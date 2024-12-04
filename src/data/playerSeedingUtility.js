import {MongoClient} from "mongodb";
// import PlayerModel from "../models/PlayerModel.js";
// import TournamentModel from "../models/TournamentModel.js";
import playerSeeds from "./playerSeeds.js";

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log("This happened");

const seedPlayers = async () => {
  console.log("PLAYERS RAN");

  const client = new MongoClient(MONGO_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("qManager");

    console.log("Connected to MongoDB");

    // Fetch tournaments from the database
    const playerCollection = db.collection("players");
    // Insert players into the database (tournaments)
    await playerCollection.insertMany(playerSeeds);

    // need await here to do the methods
    const tournamentCollection = await db.collection("tournaments").find().toArray();
    console.log(tournamentCollection);
    if (!tournamentCollection || tournamentCollection.length === 0) {
      throw new Error("No tournaments found in the database");
    }

    console.log(`Found ${tournamentCollection.length} tournaments`);
    console.log(tournamentCollection);

    // Iterate through tournaments and assign players
    for (const tournament of tournamentCollection) {
      const numPlayers = Math.floor(Math.random() * (30 - 8 + 1)) + 8; // Random between 8 and 30
      const selectedPlayers = playerSeeds.splice(0, numPlayers); // Take players from the seed file

      // Transform players to include the tournament ID
      const playersToInsert = selectedPlayers.map(player => ({
        names: player.name,
        categories: Array.isArray(player.categories)
          ? player.categories
          : [player.categories],
        phoneNumbers: Array.isArray(player.phoneNumbers)
          ? player.phoneNumbers
          : [player.phoneNumbers],
        tournamentId: tournament._id.toString() // Link to tournament _id
      }));

      const updatedQueues = tournament.queues.map(queue => ({
        ...queue,
        queueItems: playersToInsert.slice(
          0,
          Math.floor(numPlayers / tournament.queues.length)
        )
      }));
      // Insert players into the database (tournaments)
      await db
        .collection("tournaments")
        .updateOne({_id: tournament._id}, {$set: {queues: updatedQueues}});

      console.log(
        `Inserted ${updatedQueues.length} players for tournament: ${tournament.name}`
      );
    }

    console.log("Player seeding completed successfully");
  } catch (error) {
    console.error("Error seeding players:", error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("MongoDB connection closed");
  }
};

seedPlayers();
