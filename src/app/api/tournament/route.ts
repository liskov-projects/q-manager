import dbConnect from "@/lib/db";
import { TournamentModel } from "@/models/TournamentModel";
import { NextRequest } from "next/server";
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
  const { name, categories, adminUser, image, description, numberOfQueues } = body;

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
  });

  await newTournament.save();

  return new Response(JSON.stringify(newTournament), {
    headers: { "Content-Type": "application/json" },
  });
}
