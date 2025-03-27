import { NextRequest, NextResponse } from "next/server";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/UserModel";
import { TPlayer, TTournament, TQueue } from "@/types/Types";
import { TournamentModel } from "@/models/TournamentModel";
import { PlayerModel } from "@/models/PlayerModel";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();

  //  automatically gets userID so we don't need the forlder [...id]
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find user and get their favouritePlayers array (just the ObjectIds)
  const user = await UserModel.findById(userId).lean();
  if (!user || !user.favouritePlayers.length) {
    return NextResponse.json([], { status: 200 });
  }

  // Find players using the _id array stored in user.favouritePlayers
  const favouritePlayers = await PlayerModel.find({
    _id: { $in: user.favouritePlayers },
  })
    .select("_id names categories phoneNumbers tournamentId") // Only fetch relevant fields
    .lean();

  if (!favouritePlayers.length) {
    return NextResponse.json([], { status: 200 });
  }

  // Fetch all tournaments (to map _id → name)
  const tournaments = await TournamentModel.find({}, "_id name").lean();
  const tournamentNamesMap = new Map(
    tournaments.map((t: TTournament) => [t._id.toString(), t.name])
  );

  // Attach tournament names to each player
  const result = favouritePlayers.map((player: TPlayer) => ({
    ...player,
    // tournamentName: tournamentNamesMap.get(player.tournamentId?.toString()) || "Unknown",
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playerId } = await req.json();
  const user = await UserModel.findById(userId).populate("favouritePlayers"); //.lean();
  if (!user) {
    return NextResponse.json([], { status: 404 });
  }

  // ensures the reference is read ok
  const playerObjectId = new mongoose.Types.ObjectId(playerId);

  // gets all tournaments
  const tournaments = await TournamentModel.find({});
  // console.log("TOURNAments", tournaments);
  // Find the player in tournaments (if applicable) and assign a tournamentId
  const playerTournament = tournaments.find((tournament: TTournament) => {
    return (
      tournament.queues.forEach((queue: TQueue) =>
        queue.queueItems.some((item: TPlayer) => item._id.toString() === playerId)
      ) ||
      tournament.unProcessedQItems.some((item: TPlayer) => item._id.toString() === playerId) ||
      tournament.processedQItems.some((item: TPlayer) => item._id.toString() === playerId)
    );
  });

  // Ensure the player has a tournamentId (if found)
  const tournamentId = playerTournament ? playerTournament._id.toString() : null;

  // Toggle logic
  const isFav = user.favouritePlayers.some((player: TPlayer) => player._id.toString() === playerId);

  if (isFav) {
    user.favouritePlayers = user.favouritePlayers.filter(
      (player: TPlayer) => player._id.toString() !== playerId
    );
  } else {
    const updatedPlayer = {
      _id: playerObjectId,
      tournamentId,
    };
    user.favouritePlayers.push(updatedPlayer);
  }

  await user.save();
  // await UserModel.findByIdAndUpdate(userId, { favouritePlayers: user.favouritePlayers });

  return NextResponse.json(user.favouritePlayers);
}
