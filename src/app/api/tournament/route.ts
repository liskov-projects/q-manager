import dbConnect from "@/lib/db";
import { TournamentModel } from "@/models/TournamentModel";
import { NextRequest, NextResponse } from "next/server";
import QueueModel from "@/models/QueueModel";

export async function GET(req: NextRequest) {
  await dbConnect();
  const tournaments = await TournamentModel.find({});
  // console.log(tournaments);
  return new Response(JSON.stringify(tournaments), {
    headers: { "Content-Type": "application/json" },
  });
}
// OLD: used to work
export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { name, categories, adminUser, image, description, numberOfQueues, eventDate } = body;

  // makes sure we don't have name duplicates
  const existingName = await TournamentModel.findOne({ name });
  console.log("Received eventDate:", eventDate);

  if (existingName)
    return NextResponse.json({ error: "This tournament name already exists" }, { status: 409 }); //returns conflict status

  // console.log("Recieved at backend: ", body);
  // console.log("numberOfQueues", numberOfQueues);

  const queues = [];
  for (let i = 0; i < parseInt(numberOfQueues, 10); i++) {
    queues.push(
      new QueueModel({
        queueName: `queue ${i + 1}`,
        queueItems: [],
      })
    );
  }

  const newTournament = new TournamentModel({
    name,
    categories,
    adminUser,
    image,
    description,
    queues,
    eventDate: new Date(eventDate),
  });

  await newTournament.save();

  return new Response(JSON.stringify(newTournament), {
    headers: { "Content-Type": "application/json" },
  });
}
