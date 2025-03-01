// import PlayerModel from "@/models/PlayerModel";
import {TournamentModel} from "@/models/TournamentModel";
import dbConnect from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
// import Tournament from "@/components/Tournaments/TournamentCard";

// NOTE: move the POST here as well?
export async function GET(req: NextRequest) {
  // console.log("MADE IT INTO THE GET FOR TOURNAMENT PLAYERS");
  // console.log("this is REQ: ", req);
  const {url} = req;
  // console.log(typeof url);

  const tournamentId = url?.split("/").pop();
  console.log("tournamentID: ", tournamentId);
  console.log("TOURNAMENT ID IN GET ON ROUTE");
  console.log(tournamentId);
  // Ensure the database is connected
  await dbConnect();

  try {
    const tournament = await TournamentModel.findById(tournamentId)
      .select("players") // Populate player references
      .populate("queues.queueItems"); // Populate queue player references
    console.log("backend: ", tournament);
    return new Response(JSON.stringify(tournament), {
      headers: {"Content-Type": "application/json"}
    });
    // res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    // res.status(500).json({message: "Server error fetching players."});
  }
  // } else {
  //   res.setHeader("Allow", ["GET"]);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}

export async function PUT(req: NextRequest, {params}) {
  const tournamentId = params.tournament;
  // console.log(params);
  // console.log("hitting the endpoint");
  await dbConnect();

  try {
    const body = await req.json();
    // coming through ok
    console.log(body);
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      body,
      {
        new: true
      }
    );

    if (!updatedTournament) {
      return NextResponse.json({error: "Tournament not found"}, {status: 404});
    }

    const savedTournament = await TournamentModel.findById(tournamentId).populate({
      path: "queues.queueItems",
      model: "PlayerModel"
    });

    // NEW: queues are logged correctly, the db still has IDs
    console.log("BACKEND PUT: ");
    savedTournament.queues.forEach(queue => {
      console.log(queue.queueItems);
    });

    return NextResponse.json(savedTournament, {status: 200});
  } catch (err) {
    console.error("Error saving the tournament: ", err);
    return NextResponse.json({error: "Failed to save the tournament"}, {status: 500});
  }
}
