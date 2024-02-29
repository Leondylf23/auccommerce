const AuctionLive = require("./AuctionLive");

// Init
const socketEventListener = (io) => {
  io.on("connection", (socket) => {
    console.log(["Info"], `Connection from id ${socket.id}`);

    // Define Events
    AuctionLive(io, socket);
  });
};

module.exports = {
  socketEventListener,
};
