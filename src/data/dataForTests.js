import mongoose from "mongoose";

export const tournamentsForTests = [
  {
    name: "Test Tournament 1",
    categories: ["Category 1"],
    adminUser: "admin1",
    image: "image1.jpg",
    description: "First test tournament",
    queues: [
      {
        queueName: "Q2",
        queueItems: [
          { tournamentId: new mongoose.Types.ObjectId(), names: "Player 3" },
          { tournamentId: new mongoose.Types.ObjectId(), names: "Player 4" },
        ],
      },
    ],
  },
  {
    name: "Test Tournament 2",
    categories: ["Category 2"],
    adminUser: "admin2",
    image: "image2.jpg",
    description: "Second test tournament",
    queues: [
      {
        queueName: "Q1",
        queueItems: [
          { tournamentId: new mongoose.Types.ObjectId(), names: "Player 1" },
          { tournamentId: new mongoose.Types.ObjectId(), names: "Player 2" },
        ],
      },
    ],
  },
];

export const oneTournamentForTests = {
  name: "Test Tournament",
  categories: ["Category 1"],
  adminUser: "admin",
  image: "image.jpg",
  description: "A test tournament",
  numberOfQueues: 2,
};
