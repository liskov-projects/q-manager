const { MongoClient } = require("mongodb");

const tournaments = require("./tournaments-seeds.json"); // Load tournaments JSON

async function seedTournaments() {
  const client = new MongoClient("mongodb://localhost:27017"); // HERE
  try {
    await client.connect();
    const db = client.db("your_database_name"); // HERE
    const tournamentCollection = db.collection("tournaments");

    // Insert tournaments and capture inserted documents
    const result = await tournamentCollection.insertMany(tournaments);
    console.log("Tournaments inserted:", result.insertedIds);
    return result.insertedIds; // Returns an object mapping array index to _id
  } finally {
    await client.close();
  }
}

seedTournaments().then(console.log).catch(console.error);
