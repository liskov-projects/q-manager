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

    // Fetch players collection from the database
    const playerCollection = db.collection("players");
    // Insert players into the database (tournaments)

    //inserting the players into the empty players collection
    await playerCollection.insertMany(playerSeeds);

    // getting the players from the player collection to populate the tournaments
    const newPlayers = await db.collection("players").find().toArray();
    // geting the tournament collection
    const tournamentCollection = await db.collection("tournaments").find().toArray(); // need await here to do the methods

    console.log(tournamentCollection);
    if (!tournamentCollection || tournamentCollection.length === 0) {
      throw new Error("No tournaments found in the database");
    }

    console.log(`Found ${tournamentCollection.length} tournaments`);

    // Iterate through tournaments and assign players
    for (const tournament of tournamentCollection) {
      const numPlayers = Math.floor(Math.random() * (30 - 8 + 1)) + 8; // Random between 8 and 30
      const selectedPlayers = newPlayers.splice(0, numPlayers); // Take players from the seed file

      // Transform players to include the tournament ID & override assignedToQueue
      const playersToInsert = selectedPlayers.map(player => ({
        names: player.names,
        categories: Array.isArray(player.categories)
          ? player.categories
          : [player.categories],
        phoneNumbers: Array.isArray(player.phoneNumbers)
          ? player.phoneNumbers
          : [player.phoneNumbers],
        tournamentId: tournament._id.toString(),
        assignedToQueue: true, // New property
        processedThroughQueue: false
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
