import express from "express";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";

import dbConnect from "../lib/db.js";
import { TournamentModel } from "../models/TournamentModel.js";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV = process.env.ENV || "development";

// ✅ Look for .env.local in the root directory
const envPath =
  ENV === "qa"
    ? path.resolve(__dirname, "../../.env.production") // Go two levels up for root
    : path.resolve(__dirname, "../../.env.local");

dotenv.config({ path: envPath });

const PORT = process.env.NEXT_PUBLIC_PORT || 4000;

const allowedOrigins =
  ENV === "qa" ? ["https://q-manager.qa.liskov.dev"] : ["http://localhost:3000"];

console.log("Running in:", ENV);
console.log("Allowed origins:", allowedOrigins);

const app = express();
const server = http.createServer(app);

console.log(`Starting WebSocket server on PORT=${process.env.NEXT_PUBLIC_PORT}`);

app.use(
  cors({
    origin: allowedOrigins, // Temporarily allow all origins (can restrict later)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const io = new Server(server, {
  cors: {
    path: "/socket.io",
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

function findDuplicatePlayersInTournament(tournament) {
  const seen = new Map(); // Map<playerId, location[]>

  const logLocation = (player, location) => {
    const id = typeof player._id === "string" ? player._id : player._id.toString();
    if (!seen.has(id)) {
      seen.set(id, []);
    }
    seen.get(id).push(location);
  };

  // Scan unProcessedQItems
  tournament.unProcessedQItems.forEach((player) => logLocation(player, "unProcessedQItems"));

  // Scan processedQItems
  tournament.processedQItems.forEach((player) => logLocation(player, "processedQItems"));

  // Scan all queues
  tournament.queues.forEach((queue) => {
    queue.queueItems.forEach((player) => {
      logLocation(player, `queue: ${queue.queueName || queue._id}`);
    });
  });

  // Identify duplicates
  const duplicates = Array.from(seen.entries()).filter(([_, locations]) => locations.length > 1);

  if (duplicates.length > 0) {
    console.warn("🧨 DUPLICATE PLAYERS FOUND:");
    duplicates.forEach(([id, locations]) => {
      console.warn(`Player ID ${id} found in: ${locations.join(", ")}`);
    });
  } else {
    console.log("✅ No duplicate players found in this tournament.");
  }

  return duplicates.map(([id]) => id);
}

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

io.on("connection", async (socket) => {
  await dbConnect();

  console.log(`Client connected ${socket.id}`);

  // Keep connection alive
  setInterval(() => {
    socket.emit("heartbeat", { message: "still alive" });
  }, 30000);

  // WORKS:
  socket.on("addPlayer", async ({ playerData, tournamentId }) => {
    console.log(`New Player: ${JSON.stringify(playerData)} added to Tournament ${tournamentId}`);

    // this makes sure the player has the id
    const playerWithId = { ...playerData, _id: new mongoose.Types.ObjectId() };
    // Find the tournament by ID and push the new player to `unProcessedQItems`
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $push: { unProcessedQItems: playerWithId } },
      { new: true } // Returns the updated document
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    console.log("Updated tournament:", updatedTournament);

    // Emit a success message
    io.emit("playerAdded", {
      message: "io.emit playerAdded",
      tournamentId,
      updatedTournament,
      playerData: playerWithId,
    });
    console.log("📡 Sent io.emit(playerAdded)", tournamentId, playerData);
  });

  socket.on("editPlayer", async ({ tournamentId, playerData }) => {
    console.log(`Player: ${JSON.stringify(playerData)} has been updated`);

    const tournamentObjectId = new mongoose.Types.ObjectId(tournamentId);
    const playerObjectId = new mongoose.Types.ObjectId(playerData._id);

    const updatedTournament = await TournamentModel.findOneAndUpdate(
      // finds the tournament AND the player
      { _id: tournamentObjectId, "unProcessedQItems._id": playerObjectId },
      // finds the item in the array and overwrites it
      { $set: { "unProcessedQItems.$": playerData } },
      { new: true }
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    console.log("Updated tournament:", updatedTournament);

    io.emit("editPlayer", {
      message: "io.emit editPlayer",
      updatedTournament,
    });
    console.log("📡 Sent io.emit(editPlayer)", tournamentId, playerData);
  });

  socket.on("deletePlayer", async ({ playerToDelete, tournamentId }) => {
    console.log(
      `Delete Player: ${JSON.stringify(playerToDelete)} deleted from Tournament ${tournamentId}`
    );

    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $pull: { unProcessedQItems: playerToDelete } },
      { new: true }
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    console.log("Updated tournament:", updatedTournament);

    io.emit("deletePlayer", {
      message: "io.emit deletePlayer",
      updatedTournament,
    });
    console.log("📡 Sent io.emit(deletePlayer)", tournamentId);
  });

  // TODO: what is happening here & in the hook? Socket context calls the hook
  socket.on("playerDropped", async ({ message, draggedItem, dropTarget, tournamentId, index }) => {
    console.log(message, draggedItem);
    console.log("drop target", dropTarget);

    const tournamentToDeleteFrom = await TournamentModel.findOne({
      _id: tournamentId,
    });

    if (!tournamentToDeleteFrom) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    //removes item from their source arrays
    const newUnprocessedItems = tournamentToDeleteFrom.unProcessedQItems.filter((item) => {
      const isSame = item._id.toString() === draggedItem._id.toString();
      if (isSame) {
        console.log("🚷 DRAG REMOVED PLAYER from queue");
        console.log("Removed:", draggedItem);
      }
      return !isSame;
    });

    const newProcessedItems = tournamentToDeleteFrom.processedQItems.filter((item) => {
      const isSame = item._id.toString() === draggedItem._id.toString();
      if (isSame) {
        console.log("🚷 DRAG REMOVED PLAYER from queue");
        console.log("Removed:", draggedItem);
      }
      return !isSame;
    });

    // makes a copy of the queues & ensures there're no references to MongoDB properties (pure JS object) with .toObject()
    const newQueues = tournamentToDeleteFrom.queues.map((queue) => ({
      ...queue.toObject(), //here
      queueItems: queue.queueItems.filter((item) => {
        const isSame = item._id.toString() === draggedItem._id.toString();
        if (isSame) {
          console.log("🚷 DRAG REMOVED PLAYER from queue");
          console.log("Removed:", draggedItem);
        }
        return !isSame;
      }),
    }));

    // adds items to the corresponding group
    if (dropTarget === "unprocessed") {
      newUnprocessedItems.splice(index, 0, draggedItem);
    } else if (dropTarget === "processed") {
      newProcessedItems.splice(index, 0, draggedItem);
    } else {
      const queueToSplice = newQueues.find((queue) => queue._id.toString() === dropTarget);

      if (queueToSplice) {
        queueToSplice.queueItems = [
          ...queueToSplice.queueItems.slice(0, index),
          draggedItem,
          ...queueToSplice.queueItems.slice(index),
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
          queues: newQueues,
        },
      },
      { new: true }
    );

    console.log("UPDATED TOURNAMENT");
    console.log(updatedTournament);
    console.log("IN THE DRAG AND DROP");
    findDuplicatePlayersInTournament(updatedTournament);

    io.emit("playerDropped", {
      message: "roundtrip made for the playerDropped",
      draggedItem,
      index,
      dropTarget,
      // tournamentId,
      // updatedTournament
    });

    console.log("📡 Sent io.emit(playerDropped)");
  });

  // ADD PLAYER TO SHORTEST QUEUE
  socket.on("addPlayerToShortestQ", async ({ playerData, tournamentId }) => {
    console.log(`Player: ${JSON.stringify(playerData)} added to Queue`);

    //finds the tournament in the db
    const foundTournament = await TournamentModel.findById(tournamentId);
    if (!foundTournament) socket.emit({ error: "Tournament not found in addPlayerToShortestQ" });

    //removes the player from un/Processed arrs
    const updatedUnProcessedQItems = foundTournament.unProcessedQItems.filter(
      (item) => item._id.toString() !== playerData._id.toString()
    );

    const updatedProcessedQItems = foundTournament.processedQItems.filter(
      (item) => item._id.toString() !== playerData._id.toString()
    );
    // finds the shortes Q
    let shortestQ = foundTournament.queues.reduce((shortest, current) =>
      current.queueItems.length < shortest.queueItems.length ? current : shortest
    ); // .reduce compare shortest with current finding the one satifying the condition

    if (!shortestQ) socket.emit({ error: "no valid queue found" });

    // adds the player
    shortestQ.queueItems.push(playerData);

    // updates the db
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {
        $set: {
          unProcessedQItems: updatedUnProcessedQItems,
          processedQItems: updatedProcessedQItems,
          queues: foundTournament.queues,
        },
      },
      { new: true }
    );

    console.log("ADD PLAYER TO SHORTEST QUEUE");
    findDuplicatePlayersInTournament(updatedTournament);

    if (!updatedTournament) socket.emit({ error: "error updating the tournament" });

    // broadcasts the updated data
    io.emit("addPlayerToShortestQ", {
      message: "Player added to the shortest queue",
      updatedTournament,
      playerData,
    });
    console.log("📡 Sent io.emit(playerAddedToShortestQ)", tournamentId, playerData);
  });

  socket.on("addAllPlayersToQueues", async ({ tournament }) => {
    //  call db
    const foundTournament = await TournamentModel.findById(tournament._id);
    if (!foundTournament) socket.emit({ error: "Tournament not found in addPlayerToShortestQ" });
    // update the data - backend
    //NOTE: makes a pool of ALL players | or we want only UNPROCESSED?
    const unassignedPlayers = [...tournament.unProcessedQItems, ...tournament.processedQItems];

    // update the queues
    const updatedQueues = [...foundTournament?.queues];

    unassignedPlayers.forEach((player) => {
      const targetQeueue = updatedQueues.reduce((shortest, current) =>
        current.queueItems.length < shortest.queueItems.length ? current : shortest
      );
      if (!targetQeueue) socket.emit({ error: "no valid queue found" });

      targetQeueue.queueItems.push(player);
    });
    // call db to save
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournament._id,
      {
        $set: {
          unProcessedQItems: [],
          processedQItems: [],
          queues: updatedQueues,
        },
      },
      { new: true }
    );

    console.log("ADD ALL PLAYERS TO QUEUES");
    findDuplicatePlayersInTournament(updatedTournament);

    // broadcasts updated data
    io.emit("addAllPlayersToQueues", {
      message: "all Players added to queues",
      updatedTournament,
    });
  });

  socket.on("uprocessAllPlayers", async ({ tournament }) => {
    // db call to get the data
    const foundTournament = await TournamentModel.findById(tournament._id);
    if (!foundTournament) socket.emit("tournament not found in uprocessAllPlayers");

    // processes the data | need to flatten everything to the same level
    const poolOfPlayers = [
      ...foundTournament.queues.flatMap((queue) => queue.queueItems),
      ...foundTournament.unProcessedQItems,
      ...foundTournament.processedQItems,
    ];

    // console.log("Pool of players", poolOfPlayers);
    // console.log(poolOfPlayers.length);

    // db call to update
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournament._id,
      {
        $set: {
          unProcessedQItems: poolOfPlayers,
          processedQItems: [],
          // updates every queue's queueItems
          "queues.$[].queueItems": [],
        },
      },
      { new: true }
    );

    console.log("UNPROCESS ALL PLAYERS");
    findDuplicatePlayersInTournament(updatedTournament);

    // emits the event to the front
    io.emit("uprocessAllPlayers", {
      message: "All player are removed from the queues",
      updatedTournament,
    });
  });

  socket.on("processAllPlayers", async ({ tournament }) => {
    // db call to get the data
    const foundTournament = await TournamentModel.findById(tournament._id);
    if (!foundTournament) socket.emit("tournament not found in uprocessAllPlayers");

    // processes the data
    const poolOfPlayers = foundTournament.queues
      .map((queue) => queue.queueItems)
      .flat()
      .concat(foundTournament.unProcessedQItems);

    // db call to update
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournament._id,
      {
        $set: {
          unProcessedQItems: [],
          processedQItems: poolOfPlayers,
          // updates every queue's queueItems
          "queues.$[].queueItems": [],
        },
      },
      { new: true }
    );

    console.log("PROCESS ALL PLAYERS");
    findDuplicatePlayersInTournament(updatedTournament);

    // emits the event to the front
    io.emit("uprocessAllPlayers", {
      message: "All player are removed from the queues",
      updatedTournament,
    });
  });

  // NEW:
  socket.on("redistributePlayers", async ({ tournamentId, balancedQueues }) => {
    // Find the tournament from the database
    const foundTournament = await TournamentModel.findById(tournamentId);
    if (!foundTournament) {
      socket.emit("tournament not found in redistributePlayers");
      return;
    }

    // Update the queues in the database with the new balancedQueues
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {
        $set: {
          // updates every queue's queueItems with the new balancedQueues
          queues: balancedQueues,
        },
      },
      { new: true }
    );

    console.log("REDISTRIBUTE");
    findDuplicatePlayersInTournament(updatedTournament);

    // Emit the updated tournament data to all clients
    io.emit("redistributePlayers", {
      message: "Players redistributed between the queues",
      updatedTournament,
    });
  });
  //

  socket.on("processQueueOneStep", async ({ tournamentId, queueIndex }) => {
    try {
      // Fetch the tournament from DB
      const foundTournament = await TournamentModel.findById(tournamentId);
      if (!foundTournament) {
        return socket.emit("error", {
          message: "Tournament not found in processOnePlayer",
        });
      }

      // Ensure the queue index is valid
      if (queueIndex < 0 || queueIndex >= foundTournament.queues.length) {
        return socket.emit("error", { message: "Invalid queue index" });
      }

      // Get the queue and remove the first player
      const queueToUpdate = foundTournament.queues[queueIndex];
      const processedPlayer = queueToUpdate.queueItems.shift();

      if (!processedPlayer) {
        return socket.emit("error", { message: "No player to process in this queue" });
      }

      // Update the tournament
      const updatedTournament = await TournamentModel.findByIdAndUpdate(
        tournamentId,
        {
          $set: {
            [`queues.${queueIndex}.queueItems`]: queueToUpdate.queueItems,
          },
          $push: { processedQItems: processedPlayer },
        },
        { new: true }
      );

      console.log("PROCESS QUEUE ONE STEP");
      findDuplicatePlayersInTournament(updatedTournament);

      if (!updatedTournament) {
        return socket.emit("error", {
          message: "Error updating tournament in processOnePlayer",
        });
      }

      // Emit the updated data
      io.emit("processQueueOneStep", {
        message: "One player processed from queue",
        updatedTournament,
      });

      console.log("📡 Sent io.emit(processOnePlayer)", updatedTournament);
    } catch (error) {
      console.error("Error in processOnePlayer:", error);
      socket.emit("error", { message: "Internal server error in processOnePlayer" });
    }
  });

  socket.on("addQueue", async ({ tournamentId, newQueue }) => {
    console.log(`New Queue: ${JSON.stringify(newQueue)} added to Tournament ${tournamentId}`);

    // Find the tournament by ID and push the new queue to queues
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $push: { queues: newQueue } },
      { new: true } // Returns the updated document
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    console.log("Updated tournament:", updatedTournament);

    // Emit a success message
    io.emit("addQueue", {
      message: "io.emit addQueue",
      updatedTournament,
    });
    console.log("📡 Sent io.emit(addQueue)", tournamentId, newQueue);
  });

  socket.on("deleteQueue", async ({ tournamentId, queueToDelete }) => {
    console.log(
      `Delete Queue: ${JSON.stringify(queueToDelete)} deleted from Tournament ${tournamentId}`
    );

    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {
        $pull: { queues: { _id: queueToDelete._id } },
        $push: { unProcessedQItems: { $each: queueToDelete.queueItems } },
      },
      { new: true }
    );

    if (!updatedTournament) {
      console.error("Tournament not found:", tournamentId);
      return socket.emit("errorMessage", { error: "Tournament not found" });
    }

    console.log("Updated tournament:", updatedTournament);

    io.emit("deleteQueue", {
      message: "io.emit deletePlayer",
      updatedTournament,
    });
    console.log("📡 Sent io.emit(deleteQueue)", tournamentId);
  });
  // disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`WebSocket server running on port ${PORT}`));
