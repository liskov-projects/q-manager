import mongoose from "mongoose";
import PlayerModel from "../models/PlayerModel.js";
import TournamentModel from "../models/TournamentModel.js";
import playerSeeds from "./player-seeds.json" with {type: "json"};

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log("This happened");

const seedPlayers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch tournaments from the database
    const tournaments = await TournamentModel.find();
    if (!tournaments || tournaments.length === 0) {
      throw new Error("No tournaments found in the database");
    }

    console.log(`Found ${tournaments.length} tournaments`);
    console.log(tournaments);
    // Iterate through tournaments and assign players
    for (const tournament of tournaments) {
      const numPlayers = Math.floor(Math.random() * (30 - 8 + 1)) + 8; // Random between 8 and 30
      const selectedPlayers = playerSeeds.splice(0, numPlayers); // Take players from the seed file

      // Transform players to include the tournament ID
      const playersToInsert = selectedPlayers.map(player => ({
        names: player.name,
        categories: Array.isArray(player.category)
          ? player.category
          : [player.category],
        phoneNumbers: Array.isArray(player.phoneNumber)
          ? player.phoneNumber
          : [player.phoneNumber],
        tournamentId: tournament._id.toString() // Link to tournament _id
      }));

      // Insert players into the database
      const insertedPlayers = await PlayerModel.insertMany(playersToInsert);
      console.log(
        `Inserted ${insertedPlayers.length} players for tournament: ${tournament.name}`
      );
    }

    console.log("Player seeding completed successfully");
  } catch (error) {
    console.error("Error seeding players:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedPlayers();
