// src/data/playerSeedingQA.js
import { MongoClient, ObjectId } from "mongodb";
import updatedPlayersData from "./UPDATEDplayersData.js";
import dotenv from "dotenv";
import path from "path";

// ✅ Load from .env.qa
dotenv.config({ path: path.resolve(process.cwd(), ".env.qa") });

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is undefined! Check .env.qa");
}

const seedPlayers = async () => {
  console.log("🌱 Starting QA player seed");

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db("qManager");

    await db.collection("players").deleteMany({});
    await db.collection("users").deleteMany({});

    const playerCollection = db.collection("players");
    const tournamentCollection = db.collection("tournaments");

    const tournaments = await tournamentCollection.find().toArray();

    if (!tournaments.length) {
      throw new Error("No tournaments found in DB");
    }

    for (const tournament of tournaments) {
      const playersForTournament = updatedPlayersData.map((player) => ({
        ...player,
        _id: new ObjectId(), // Unique per tournament
        tournamentId: tournament._id.toString(),
      }));

      await tournamentCollection.updateOne(
        { _id: tournament._id },
        { $set: { unProcessedQItems: playersForTournament } }
      );

      console.log(`✅ Assigned ${playersForTournament.length} to "${tournament.name}"`);
    }

    console.log("✅ Player seeding for QA done");
  } catch (err) {
    console.error("🚨 Player seeding failed:", err);
  } finally {
    await client.close();
  }
};

seedPlayers();
