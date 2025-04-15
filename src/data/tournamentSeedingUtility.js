import { MongoClient, ObjectId } from "mongodb"; // Import ObjectId
import tournamentsData from "./tournamentsData.js";
import dotenv from "dotenv";
import path from "path";

// Load from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is undefined in TournamentSeeding! Check your .env file.");
}

async function seedTournaments() {
  console.log("TOURNAMENTS RAN");

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("Connected to db");

    const db = client.db("qManager");

    // NEW: clears up the collection if it exists to avoid duplication
    await db.collection("tournaments").deleteMany({});
    await db.collection("players").deleteMany({});

    const tournamentCollection = db.collection("tournaments");

    // Ensure each queue gets an ObjectId before insertion
    const modifiedTournamentsData = tournamentsData.map((tournament) => ({
      ...tournament,
      queues: tournament.queues.map((queue) => ({
        ...queue,
        _id: new ObjectId(), // Assign MongoDB ObjectId to each queue
      })),
    }));

    // Insert tournaments and capture inserted documents
    const result = await tournamentCollection.insertMany(modifiedTournamentsData);
    console.log("Tournaments inserted:", result.insertedIds);
    return result.insertedIds; // Returns an object mapping array index to _id
  } finally {
    await client.close();
  }
}

seedTournaments().then(console.log).catch(console.error);
