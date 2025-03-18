import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { TournamentModel } from "@/models/TournamentModel";
import { POST, GET } from "@/app/api/tournament/route";
import { afterEach } from "@jest/globals";
import { TTournament } from "../../../../types/Types";
import { NextRequest } from "next/server";

beforeAll(async () => {
  await dbConnect();
});

afterEach(async () => {
  await TournamentModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const route = "http://localhost/api/tournament";

test("POST /api/tournament creates a new tournament", async () => {
  const body = {
    name: "Test Tournament",
    categories: ["Category 1"],
    adminUser: "admin",
    image: "image.jpg",
    description: "A test tournament",
    numberOfQueues: 2,
  };
  // creates mock request object with NextRequest object
  const req = new NextRequest(route, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  // creates mock response object
  const res = await POST(req);

  //   checks for the status code 200
  expect(res.status).toBe(200);

  // find created tournament in the db
  const createdTournament = await TournamentModel.findOne({ name: "Test Tournament" });
  expect(createdTournament).toBeTruthy();
});

test("GET /api/tournament fetches the tournaments", async () => {
  // inserts tournaments into the mock db
  const tournaments = [
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
  await TournamentModel.insertMany(tournaments);

  // creates a mock req
  const req = new NextRequest(route, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // mock res
  const res = await GET(req);
  const data = await res.json();

  // return the expected status code
  expect(res.status).toBe(200);

  // additional check
  expect(Array.isArray(data)).toBe(true); // ensures we have an array
  data.forEach((tournament: TTournament, idx: number) => {
    expect(tournament).toMatchObject({
      name: tournaments[idx].name,
      categories: expect.arrayContaining(tournaments[idx].categories),
      adminUser: tournaments[idx].adminUser,
      image: tournaments[idx].image,
      description: tournaments[idx].description,
      queues: tournaments[idx].queues.map((queue) => ({
        queueName: queue.queueName,
        queueItems: queue.queueItems.map((item) => ({
          names: item.names,
          tournamentId: item.tournamentId.toString(), // Convert ObjectId to string
        })),
      })),
    });
  });

  expect(data.length).toBe(tournaments.length); //checks the length of data === the inserted tournaments
});
