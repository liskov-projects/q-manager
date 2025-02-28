require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const dbConnect = require("../src/lib/db");
const PlayerModel = require("../src/models/PlayerModel");
const TournamentModel = require("../src/models/TournamentModel");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", socket => {
  console.log(`Client connected ${socket.id}`);
  // registers the event
  socket.on("addPlayer", ({playerData, tournamentId}) => {

    console.log(`New Player: ${JSON.stringify(playerData)} added to Tournament ${tournamentId}`);




    // broadcasts the update to all clients
    io.emit("tournamentUpdated", {tournamentId, playerData});

  });

  // disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
