import dbConnect from "@/lib/db";
import { PlayerModel } from "@/models/PlayerModel";
import { QueueModel } from "@/models/QueueModel";
import { TournamentModel } from "@/models/TournamentModel";
import { error } from "console";
// import TournamentModel from "@/models/TournamentModel";
import { NextRequest } from "next/server";

// export async function GET() {
//   await dbConnect();
//   try {
//     const players = await PlayerModel.find({});
//     // console.log("PLAYERS");
//     // console.log(players);
//     return new Response(JSON.stringify(players), {
//       headers: {"Content-Type": "application/json"}
//     });
//   } catch (err) {
//     if (err) {
//       console.error(err);
//     }
//   }
// }

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  // console.log("Recieved at backend: ", body);
  // handles incoming JSON
  const { names, categories, phoneNumbers, tournamentId } = body;

  // NEW:
  // const tournament = await TournamentModel.find({_id: new Object(tournamentId)});
  //
  console.log("Names: ", names);
  console.log("Categories: ", categories);
  console.log("phoneNumbers: ", phoneNumbers);
  console.log("tournament id ", tournamentId);
  // creates a new entry using the incoming data
  const newPlayer = new PlayerModel({
    names,
    categories,
    phoneNumbers,
    tournamentId,
  });

  const updatedTournament = await TournamentModel.findOneAndUpdate(
    { _id: tournamentId },
    { $push: { unProcessedQItems: newPlayer } },
    { new: true }
  );

  if (!updatedTournament) {
    return new Response(JSON.stringify({ error: "Tournament not found" }), {
      status: 404,
    });
  }

  // Step 4: Return success response
  return new Response(JSON.stringify({ player: newPlayer, tournament: updatedTournament }), {
    headers: { "Content-Type": "application/json" },
  });
}
