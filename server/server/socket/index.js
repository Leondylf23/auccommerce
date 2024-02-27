const AuctionLive = require("./AuctionLive");

// Init
const socketEventListener = (io) => {
  io.on("connection", (socket) => {
    console.log(["info"], `Connection from id ${socket.id}`);

    AuctionLive(io, socket);
  });
};

// Define Events

module.exports = {
  socketEventListener,
};
