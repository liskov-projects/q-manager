import mongoose from "mongoose";
import { TTournament, TPlayer, TQueue } from "@/types/Types.js";

export const tournamentsForTests = [
  {
    _id: "67c78f4126973a0d1990b417",
    name: "Echuca",
    adminUser: "user_2oy9dZf23XA9qCAPeqGCrKhD315",
    categories: ["teens", "male", "female"],
    image: "",
    queues: [
      {
        _id: "q1",
        tournamentId: "67c78f4126973a0d1990b417",
        queueName: "Location 1",
        queueItems: [
          {
            _id: "67c78f4126973a0d1990b427",
            names: "Player 61 vs Player 68",
            categories: ["female"],
            phoneNumbers: ["04922 323 4698"],
            tournamentId: "67c78f4126973a0d1990b417",
          },
          {
            _id: "67c78f4126973a0d1990e428",
            names: "Player 47 vs Player 124",
            categories: ["female"],
            phoneNumbers: ["04593 150 3924"],
            tournamentId: "67c78f4126973a0d1990b417",
          },
          {
            _id: "67c78f4126973a0d1990e426",
            names: "Player 39 vs Player 98",
            categories: ["female"],
            phoneNumbers: ["04155 128 3685"],
            tournamentId: "67c78f4126973a0d1990b417",
          },
        ],
      },
    ],
    processedQItems: [],
    unProcessedQItems: [],
    description: "A regional tournament in Echuca.",
  },
  {
    _id: "67c78f4126973a0d1990b500",
    name: "Bendigo Open",
    adminUser: "user_XYZ9876ABC123",
    categories: ["male", "female"],
    image: "",
    queues: [
      {
        _id: "q7",
        tournamentId: "67c78f4126973a0d1990b500",
        queueName: "Main Court",
        queueItems: [
          {
            _id: "67c78f4126973a0d1990b501",
            names: "Player 22 vs Player 33",
            categories: ["male"],
            phoneNumbers: ["04812 567 2345"],
            tournamentId: "67c78f4126973a0d1990b500",
          },
        ],
      },
      {
        _id: "q8",
        tournamentId: "67c78f4126973a0d1990b500",
        queueName: "Side Court",
        queueItems: [],
      },
    ],
    processedQItems: [
      {
        _id: "67c78f4126973a0d1990b502",
        names: "Player 44 vs Player 55",
        categories: ["female"],
        phoneNumbers: ["04982 467 9987"],
        tournamentId: "67c78f4126973a0d1990b500",
      },
    ],
    unProcessedQItems: [],
    description: "An open tournament held in Bendigo.",
  },
];

export const oneTournamentForTests = { ...tournamentsForTests[0] };

export const oneItemForTests = { ...oneTournamentForTests.queues[0].queueItems[0] };
