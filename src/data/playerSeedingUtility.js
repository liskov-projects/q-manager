import { MongoClient } from "mongodb";
// import playerSeeds from "./playerSeeds.js";
import playersData from "./playersData.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is undefined in PlayerSeeding! Check your .env file.");
}
const seedPlayers = async () => {
  console.log("Starting the player seeding process...");

  const client = new MongoClient(MONGO_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("qManager");

    console.log("Connected to MongoDB");

    // Fetch or create the players collection
    const playerCollection = db.collection("players");
    const tournamentCollection = db.collection("tournaments");

    // Insert players into the players collection
    await playerCollection.insertMany(playersData);
    console.log(`Inserted ${playersData.length} players into the database`);

    // Fetch all players and tournaments
    const newPlayers = await playerCollection.find().toArray();
    const tournaments = await tournamentCollection.find().toArray();

    if (!tournaments || tournaments.length === 0) {
      throw new Error("No tournaments found in the database");
    }

    console.log(`Found ${tournaments.length} tournaments`);

    // Calculate the number of players per tournament
    const numTournaments = tournaments.length;
    const numPlayersPerTournament = Math.floor(newPlayers.length / numTournaments);
    let remainingPlayers = newPlayers.length % numTournaments;

    let playerIndex = 0;

    for (const tournament of tournaments) {
      const playersToInsert = [];

      // Distribute a base number of players to this tournament
      for (let i = 0; i < numPlayersPerTournament; i++) {
        if (playerIndex < newPlayers.length) {
          playersToInsert.push({
            ...newPlayers[playerIndex],
            tournamentId: tournament._id.toString(),
          });
          playerIndex++;
        }
      }

      // Distribute any remaining players one by one
      if (remainingPlayers > 0 && playerIndex < newPlayers.length) {
        playersToInsert.push({
          ...newPlayers[playerIndex],
          tournamentId: tournament._id.toString(),
        });
        playerIndex++;
        remainingPlayers--;
      }

      // // Assign players to queues evenly
      // const numQueues = tournament.queues.length;
      // const updatedQueues = tournament.queues.map((queue, index) => ({
      //   ...queue,
      //   queueItems: playersToInsert.filter((_, idx) => idx % numQueues === index)
      // }));

      // Update the tournament document in the database
      await tournamentCollection.updateOne(
        { _id: tournament._id },
        { $set: { unProcessedQItems: playersToInsert } }
      );

      console.log(`Assigned ${playersToInsert.length} players to tournament "${tournament.name}"`);
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
