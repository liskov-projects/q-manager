import {TournamentModel} from "@/models/TournamentModel";
import dbConnect from "@/lib/db";
import {QueueModel} from "@/models/QueueModel";
import {TQueue} from "@/types/Types";
import {NextRequest, NextResponse} from "next/server";

export async function GET() {
  await dbConnect();
  const queues = await TournamentModel.aggregate([
    {
      $group: {
        _id: "$tournamentId",
        queues: {$push: "$$ROOT"}
      }
    },
    {
      $lookup: {
        from: "tournaments",
        localField: "_id",
        as: "tournamentDetails"
      }
    }
  ]);
  console.log("QUEUES");
  console.log(queues);
  return new Response(JSON.stringify(queues), {
    headers: {"Content-Type": "application/json"}
  });
}

// NEW:
export async function POST(req: NextRequest) {
  console.log("Adding new queue...");

  try {
    await dbConnect();
    const body: TQueue = await req.json();
    const {queueName, queueItems, tournamentId} = body;

    // Validate request data
    if (!queueName || !tournamentId) {
      return NextResponse.json(
        {error: "Queue name and tournament ID are required"},
        {status: 400}
      );
    }

    // Find the tournament
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return NextResponse.json({error: "Tournament not found"}, {status: 404});
    }

    // Add the new queue
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {$push: {queues: {queueName, queueItems}}}, // Append queue
      {new: true}
    );

    console.log("Queue added:", updatedTournament);
    return NextResponse.json(updatedTournament, {status: 201});
  } catch (error) {
    console.error("Error adding queue:", error);
    return NextResponse.json({error: "Failed to add queue"}, {status: 500});
  }
}
