import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { TournamentModel } from "@/models/TournamentModel";
import { POST, GET } from "@/app/api/tournament/route";
import { afterEach } from "@jest/globals";
import { TTournament } from "../../types/Types.js";
import { NextRequest } from "next/server";
import { tournamentsForTests, oneTournamentForTests } from "../../data/dataForTests.js";

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
  const body = oneTournamentForTests;
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
  await TournamentModel.insertMany(tournamentsForTests);

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
      name: tournamentsForTests[idx].name,
      categories: expect.arrayContaining(tournamentsForTests[idx].categories),
      adminUser: tournamentsForTests[idx].adminUser,
      image: tournamentsForTests[idx].image,
      description: tournamentsForTests[idx].description,
      queues: tournamentsForTests[idx].queues.map((queue) => ({
        queueName: queue.queueName,
        queueItems: queue.queueItems.map((item) => ({
          names: item.names,
          tournamentId: item.tournamentId.toString(), // Convert ObjectId to string
        })),
      })),
    });
  });

  expect(data.length).toBe(tournamentsForTests.length); //checks the length of data === the inserted tournaments
});
