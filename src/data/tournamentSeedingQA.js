import { MongoClient, ObjectId } from "mongodb";
import tournamentsData from "./tournamentsData.js";
import dotenv from "dotenv";
import path from "path";

// ✅ Load from .env.qa
dotenv.config({ path: path.resolve(process.cwd(), ".env.qa") });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is undefined in TournamentSeedingQA! Check .env.qa.");
}

async function seedTournaments() {
  console.log("🌱 Starting QA tournament seed");

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("qManager");

    // 🔄 Clear existing tournaments
    await db.collection("tournaments").deleteMany({});
    const tournamentCollection = db.collection("tournaments");

    // 🆔 Assign ObjectIds to each queue
    const modifiedTournamentsData = tournamentsData.map((tournament) => ({
      ...tournament,
      queues: tournament.queues.map((queue) => ({
        ...queue,
        _id: new ObjectId(),
      })),
    }));

    // ➕ Insert new tournament data
    const result = await tournamentCollection.insertMany(modifiedTournamentsData);
    console.log("✅ Tournaments inserted:", Object.values(result.insertedIds));

    return result.insertedIds;
  } catch (err) {
    console.error("🚨 Tournament seeding failed:", err);
  } finally {
    await client.close();
    console.log("🔚 MongoDB connection closed");
  }
}

seedTournaments();
