import {MongoClient} from "mongodb";
import tournamentData from "./tournamentData.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedTournaments() {
  console.log("TOURNAMENTS RAN");

  // return

  const client = new MongoClient(MONGO_URI); // HERE
  try {
    await client.connect();
    const db = client.db("qManager"); // HERE
    const tournamentCollection = db.collection("tournaments");

    // Insert tournaments and capture inserted documents
    const result = await tournamentCollection.insertMany(tournamentData);
    console.log("Tournaments inserted:", result.insertedIds);
    return result.insertedIds; // Returns an object mapping array index to _id
  } finally {
    await client.close();
  }
}

seedTournaments().then(console.log).catch(console.error);
