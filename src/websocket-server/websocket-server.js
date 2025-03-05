import dotenv from "dotenv";
import express from "express";
import {Server} from "socket.io";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";

import {PlayerModel} from "../models/PlayerModel.js";
import {TournamentModel} from "../models/TournamentModel.js";

import dbConnect from "../lib/db.js"; // Ensure correct path

dotenv.config({path: "../.env"});

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
    console.log(
      `New Player: ${JSON.stringify(playerData)} added to Tournament ${tournamentId}`
    );

    // this makes sure the player has the id
    const playerWithId = {...playerData, _id: new mongoose.Types.ObjectId()};
    // Find the tournament by ID and push the new player to `unProcessedQItems`
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {$push: {unProcessedQItems: playerWithId}},
      {new: true} // Returns the updated document
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", {error: "Tournament not found"});
    }

    console.log("Updated tournament:", updatedTournament);

    // Emit a success message
    io.emit("playerAdded", {
      message: "io.emit playerAdded",
      tournamentId,
      // change: {type: "addPlayer", playerData},
      updatedTournament,
      playerData: playerWithId
    });
    console.log("📡 Sent io.emit(playerAdded)", tournamentId, playerData);

    // socket.emit("playerAdded", {
    //   message: "socket.emit Player added",
    //   data: { tournamentId, playerData }
    // });
    // console.log("📡 Sent socket.emit(playerAdded)", tournamentId, playerData);
  });

  // NEW:
  socket.on(
    "playerDropped",
    async ({message, draggedItem, dropTarget, tournamentId, index}) => {
      console.log(message, draggedItem);
      console.log("drop target", dropTarget);

      const tournamentToUpdate = await TournamentModel.findOne({_id: tournamentId});

      // ✅ Remove from `unProcessedQItems`
      const newUnprocessedItems = tournamentToUpdate.unProcessedQItems.filter(
        item => item._id.toString() !== draggedItem._id.toString()
      );

      // ✅ Remove from `processedQItems`
      const newProcessedItems = tournamentToUpdate.processedQItems.filter(
        item => item._id.toString() !== draggedItem._id.toString()
      );

      // ✅ Remove from `queues.queueItems`
      const newQueues = tournamentToUpdate.queues.map(queue => ({
        ...queue,
        queueItems: queue.queueItems.filter(
          item => item._id.toString() !== draggedItem._id.toString()
        )
      }));

      // ✅ Update the tournament in one go
      const updatedTournament = await TournamentModel.findByIdAndUpdate(
        tournamentId,
        {
          $set: {
            unProcessedQItems: newUnprocessedItems,
            processedQItems: newProcessedItems,
            queues: newQueues
          }
        },
        { new: true } // ✅ Return the updated tournament
      );

      // const newProcessedItems = tournamentToUpdate.processedQItems.filter(item => item._id !== draggedItem._id);

      // tournamentToUpdate.queues.map(queue => {

      // })

      // if (dropTarget === "unprocessed") {
      //   tournamentToUpdate.unProcessedQItems.splice(index + 1, 0, draggedItem);
      // }
      // if (dropTarget === "processed") {
      //   tournamentToUpdate.processedQItems.splice(index + 1, 0, draggedItem);
      // } else {
      //   const targetQueue = tournamentToUpdate.queues.find(dropTarget);
      //   targetQueue.queueItems.splice(index + 1, 0, draggedItem);
      // }
      io.emit("playerDropped", {
        message: "roundtrip made for the playerDropped",
        draggedItem
      });

      console.log("📡 Sent io.emit(playerDropped)");
    }
  );

  // disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
