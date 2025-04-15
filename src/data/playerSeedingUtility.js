// src/data/playerSeedingUtility.js (Dev version)
import { MongoClient, ObjectId } from "mongodb";
import updatedPlayersData from "./UPDATEDplayersData.js";
import dotenv from "dotenv";
import path from "path";

// Load from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is undefined in PlayerSeeding! Check your .env.local file.");
}

const seedPlayersIntoDevTournaments = async () => {
  console.log("🌱 Seeding players into dev tournaments...");

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db("qManager");

    const tournamentCollection = db.collection("tournaments");
    const tournaments = await tournamentCollection.find().toArray();

    if (!tournaments.length) {
      throw new Error("No tournaments found in the database");
    }

    for (const tournament of tournaments) {
      const players = updatedPlayersData.map((player) => ({
        ...player,
        _id: new ObjectId(),
        tournamentId: tournament._id.toString(),
      }));

      await tournamentCollection.updateOne(
        { _id: tournament._id },
        { $set: { unProcessedQItems: players } }
      );

      console.log(`✅ Inserted ${players.length} players into "${tournament.name}"`);
    }

    console.log("✅ Dev player seeding complete.");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
};

seedPlayersIntoDevTournaments();
