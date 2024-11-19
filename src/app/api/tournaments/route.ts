import dbConnect from "@/lib/db";
import TournamentModel from "@/models/TournamentModel";
import {NextRequest} from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  console.log("Recieved at backend: ", body);
  const {name, categories, adminUser, image, description, queues, players} = body;
  const newTournament = new TournamentModel({
    name,
    categories,
    adminUser,
    image,
    description,
    queues,
    players
  });

  await newTournament.save();

  return new Response(JSON.stringify(newTournament), {
    headers: {"Content-Type": "application/json"}
  });
}
