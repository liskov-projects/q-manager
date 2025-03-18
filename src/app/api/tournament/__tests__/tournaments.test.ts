import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { TournamentModel } from "@/models/TournamentModel";
import { POST } from "@/app/api/tournament/route";
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
  const req = new NextRequest("http://localhost/api/tournament", {
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
