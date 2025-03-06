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

  // WORKS:
  socket.on(
    "playerDropped",
    async ({message, draggedItem, dropTarget, tournamentId, index}) => {
      console.log(message, draggedItem);
      console.log("drop target", dropTarget);

      const tournamentToDeleteFrom = await TournamentModel.findOne({
        _id: tournamentId
      });

      if (!tournamentToDeleteFrom) {
        console.error("Tournament not found:", tournamentId);
        return socket.emit("errorMessage", {error: "Tournament not found"});
      }

      //removes item from their source arrays
      const newUnprocessedItems = tournamentToDeleteFrom.unProcessedQItems.filter(
        item => item._id.toString() !== draggedItem._id.toString()
      );

      const newProcessedItems = tournamentToDeleteFrom.processedQItems.filter(
        item => item._id.toString() !== draggedItem._id.toString()
      );

      // makes a copy of the queues & ensures there're no references to MongoDB properties (pure JS object) with .toObject()
      const newQueues = tournamentToDeleteFrom.queues.map(queue => ({
        ...queue.toObject(), //here
        queueItems: queue.queueItems.filter(
          item => item._id.toString() !== draggedItem._id.toString()
        )
      }));

      // adds items to the correesponding group
      if (dropTarget === "unprocessed") {
        newUnprocessedItems.splice(index + 1, 0, draggedItem);
      } else if (dropTarget === "processed") {
        newProcessedItems.splice(index + 1, 0, draggedItem);
      } else {
        const queueToSplice = newQueues.find(
          queue => queue._id.toString() === dropTarget
        );

        if (queueToSplice) {
          queueToSplice.queueItems = [
            ...queueToSplice.queueItems.slice(0, index + 1),
            draggedItem,
            ...queueToSplice.queueItems.slice(index + 1)
          ];
        }
      }

      //sends the updated tournament to the DB
      const updatedTournament = await TournamentModel.findByIdAndUpdate(
        tournamentId,
        {
          $set: {
            unProcessedQItems: newUnprocessedItems,
            processedQItems: newProcessedItems,
            queues: newQueues
          }
        },
        {new: true}
      );

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
