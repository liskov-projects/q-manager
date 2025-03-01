import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

import {PlayerModel} from "../models/PlayerModel.js";
import {TournamentModel} from "../models/TournamentModel.js";

import dbConnect from "../lib/db.js"; // Ensure correct path

dotenv.config({path: "../.env.local"});

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", async socket => {
  
  await dbConnect();

  console.log(`Client connected ${socket.id}`);
  // registers the event
  socket.on("addPlayer", async ({playerData, tournamentId}) => {

    console.log(`New Player: ${JSON.stringify(playerData)} added to Tournament ${tournamentId}`);

    // Find the tournament by ID and push the new player to `unProcessedQItems`
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $push: { unProcessedQItems: playerData } },
      { new: true } // Returns the updated document
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    console.log("Updated tournament:", updatedTournament);

    // Emit a success message
    io.emit("tournamentUpdated", {
      tournamentId,
      change: { type: "addPlayer", playerData },
      updatedTournament,
    });

    socket.emit("playerAddedSuccess", { message: "Player added successfully" });

  });

  // disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
