import {MongoClient} from "mongodb";
import tournamentsData from "./tournamentsData.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedTournaments() {
  console.log("TOURNAMENTS RAN");

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("qManager");
    const tournamentCollection = db.collection("tournaments");

    // Insert tournaments and capture inserted documents
    const result = await tournamentCollection.insertMany(tournamentsData);
    console.log("Tournaments inserted:", result.insertedIds);
    return result.insertedIds; // Returns an object mapping array index to _id
  } finally {
    await client.close();
  }
}

seedTournaments().then(console.log).catch(console.error);
