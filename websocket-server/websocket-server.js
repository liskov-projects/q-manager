require("dotenv").config();
const express = require("express");
const {Server} = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", socket => {
  console.log(`Client connected ${socket.id}`);
  // registers the event
  socket.on("addPlayer", ({playerData, tournamentId}) => {
    console.log(`New Player: ${playerData.name} added to Tournament ${tournamentId}`);
    // broadcasts the update to all clients
    io.emit("tournamentUpdated", {tournamentId, playerData});
  });

  // disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnectd: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 400;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
