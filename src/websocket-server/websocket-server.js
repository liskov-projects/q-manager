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
  });

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
        draggedItem,
        index,
        dropTarget
        // tournamentId,
        // updatedTournament
      });

      console.log("📡 Sent io.emit(playerDropped)");
    }
  );

  // WORKS:
  socket.on("addPlayerToShortestQ", async ({playerData, tournamentId}) => {
    console.log(`Player: ${JSON.stringify(playerData)} added to Queue`);

    //finds the tournament in the db
    const foundTournament = await TournamentModel.findById(tournamentId);
    if (!foundTournament)
      socket.emit({error: "Tournament not found in addPlayerToShortestQ"});

    //removes the player from un/Processed arrs
    const updatedUnProcessedQItems = foundTournament.unProcessedQItems.filter(
      item => item._id.toString() !== playerData._id.toString()
    );

    const updatedProcessedQItems = foundTournament.processedQItems.filter(
      item => item._id.toString() !== playerData._id.toString()
    );
    // finds the shortes Q
    let shortestQ = foundTournament.queues.reduce((shortest, current) =>
      current.queueItems.length < shortest.queueItems.length ? current : shortest
    ); // .reduce compare shortest with current finding the one satifying the condition

    if (!shortestQ) socket.emit({error: "no valid queue found"}); //NOTE: what if they're all even?

    // adds the player
    shortestQ.queueItems.push(playerData);

    // updates the db
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {
        $set: {
          unProcessedQItems: updatedUnProcessedQItems,
          processedQItems: updatedProcessedQItems,
          queues: foundTournament.queues
        }
      },
      {new: true}
    );
    if (!updatedTournament) socket.emit({error: "error updating the tournament"});

    // broadcasts the updated data
    io.emit("addPlayerToShortestQ", {
      message: "Player added to the shortest queue",
      updatedTournament,
      playerData
    });
    console.log("📡 Sent io.emit(playerAddedToShortestQ)", tournamentId, playerData);
  });

  // disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
