import dbConnect from "@/lib/db";
import PlayerModel from "@/models/PlayerModel";
import {NextRequest} from "next/server";

export async function GET() {
  await dbConnect();
  const players = await PlayerModel.find({});
  // console.log("PLAYERS");
  // console.log(players);
  return new Response(JSON.stringify(players), {
    headers: {"Content-Type": "application/json"}
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  // console.log("Recieved at backend: ", body);
  // handles incoming JSON
  const {names, categories, phoneNumbers} = body;

  // console.log("Names: ", names);
  // console.log("Categories: ", categories);
  // console.log("phoneNumbers: ", phoneNumbers);

  // creates a new entry using the incoming data
  const newPayer = new PlayerModel({names, categories, phoneNumbers});

  // saves to db
  await newPayer.save();

  // Response - NextJS constructor that sends data to from server to client
  return new Response(JSON.stringify(newPayer), {
    headers: {"Content-Type": "application/json"}
  });
}
