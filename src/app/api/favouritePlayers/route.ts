import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/UserModel";
import { TPlayer, TTournament, TQueue } from "@/types/Types";
import { TournamentModel } from "@/models/TournamentModel";

// WORKS:
export async function GET(req: NextRequest) {
  await dbConnect();

  //  automatically gets userID so we don't need the folder [...id]
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // finds the user and gets favouritePlayers arr as ObjectId[]
  const user = await UserModel.findOne({ clerkId: userId });

  if (!user) {
    return NextResponse.json({ error: "No user" }, { status: 404 });
  }

  const tournaments = await TournamentModel.find({});

  const result = user.favouritePlayers.map((player: TPlayer) => {
    // console.log("PLAYER before populating", player);

    const playerTournament = tournaments.find((tournament: TTournament) => {
      return (
        tournament.queues.some((queue: TQueue) =>
          queue.queueItems.some((item: TPlayer) => item._id.toString() === player._id.toString())
        ) ||
        tournament.unProcessedQItems.some(
          (item: TPlayer) => item._id.toString() === player._id.toString()
        ) ||
        tournament.processedQItems.some(
          (item: TPlayer) => item._id.toString() === player._id.toString()
        )
      );
    });
    //
    const foundPlayer = tournaments
      .flatMap((tournament: TTournament) => [
        ...tournament.queues.flatMap((queue: TQueue) => queue.queueItems),
        ...tournament.unProcessedQItems,
        ...tournament.processedQItems,
      ])
      .find((item: TPlayer) => item._id.toString() === player._id.toString());

    return {
      ...player,
      _id: player._id.toString(), // Ensure _id is a string
      names: foundPlayer ? foundPlayer.names : player.names, // Use found player’s name if available
      tournamentName: playerTournament ? playerTournament.name : "Unknown",
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playerId } = await req.json();

  const user = await UserModel.findOne({ clerkId: userId });

  if (!user) {
    return NextResponse.json({ error: "No user" }, { status: 500 });
  }

  user.favouritePlayers.push(playerId);
  user.markModified("favouritePlayers");
  await user.save();
  return NextResponse.json(user.favouritePlayers);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  // gets the userId from the authentication
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playerId } = await req.json();

  const user = await UserModel.findOne({ clerkId: userId });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // checks for the player
  const itemToRemove = user.favouritePlayers.find((item: TPlayer) => {
    return item._id.toString() === playerId;
  });

  if (!itemToRemove) {
    return NextResponse.json({ message: "Player not found in favourites" }, { status: 404 });
  }

  // removes playerId from the array
  user.favouritePlayers.pull(playerId);
  await user.save();

  return NextResponse.json({ message: "Player removed from favourites", user });
}
