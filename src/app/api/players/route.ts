import dbConnect from "@/lib/db";
import PlayerModel from "@/models/PlayerModel";
import TournamentModel from "@/models/TournamentModel";
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
  const {names, categories, phoneNumbers, tournamentId} = body;

  // NEW:
  const tournamnet = await TournamentModel.find({_id: new Object(tournamentId)});
  //
  // console.log("Names: ", names);
  // console.log("Categories: ", categories);
  // console.log("phoneNumbers: ", phoneNumbers);

  // creates a new entry using the incoming data
  const newPayer = new PlayerModel({
    names,
    categories,
    phoneNumbers,
    tournamentId: tournamnet
  });

  // saves to db
  await newPayer.save();

  // Response - NextJS constructor that sends data to from server to client
  return new Response(JSON.stringify(newPayer), {
    headers: {"Content-Type": "application/json"}
  });
}
