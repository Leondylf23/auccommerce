const express = require("express");
const dotenv = require("dotenv");
const Boom = require("boom");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config();

const app = express();
const Port = process.env.NODEJS_PORT || 8080;
// Import socket.io
const { socketEventListener } = require("./server/socket");

// Initialize Redis Connection
const { redisConnect } = require("./server/services/redis");

// Initialize Watchdog Functions
const InitTimers = require("./server/timers");

// Import routes
const AuthUser = require("./server/api/authUser");
const Auctions = require("./server/api/auctions");
const MyBids = require("./server/api/myBids");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handling Invalid Input
app.use((error, req, res, next) => {
  if (error) {
    console.log(["API Request", "Invalid input", "ERROR"], { info: error });
    res.statusCode = 400;
    // Log Transaction
    const timeDiff = process.hrtime(req.startTime);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      timeTaken,
    };
    console.log(["API Request", "Invalid input", "info"], logData);
    return res.status(400).json(Boom.badRequest().output.payload);
  }

  next();
});

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = async (data) => {
    res.send = oldSend; // set function back to avoid the 'double-send'
    const statusCode =
      (data.output && data.output.statusCode) || res.statusCode;
    let bodyResponse = data;

    if (statusCode !== 200 && data.isBoom) {
      bodyResponse = data.output.payload;
    }

    const response = {
      statusCode,
      bodyResponse,
    };

    // Log Transaction
    const timeDiff = process.hrtime(req.startTime);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      timeTaken,
    };

    console.log(["API Request", "info"], logData);
    return res.status(response.statusCode).send(response.bodyResponse); // just call as normal with data
  };

  next();
});

// Route middlewares
app.use("/api/auth", AuthUser);
app.use("/api/auction", Auctions);
app.use("/api/my-bids", MyBids);

// Sys ping api
app.get("/sys/ping", (req, res) => {
  req.startTime = process.hrtime();
  res.send("ok");
});

const server = http.createServer(app);
const frontendOrigins = ["http://localhost:5050", "http://192.168.0.10:5050"];

console.log(
  ["Info"],
  `Allowed origins for server: ${frontendOrigins.map((e) => `${e}\n`)}`
);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Initialize startup functions
socketEventListener(io);
redisConnect();
InitTimers();


server.listen(Port, () => {
  console.log(["Info"], `Socket and Server open on port: ${Port}`);
});
