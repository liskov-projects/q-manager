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

  // finds the user and gets favouritePlayers arr as ObjectId[]
  const user = await UserModel.findById(userId)
    .populate({
      path: "favouritePlayers",
      select: "_id names categories phoneNumbers tournamentId",
      populate: { path: "tournamentId", select: "_id name" },
    })
    .lean();

  if (!user || !user.favouritePlayers.length) {
    return NextResponse.json([], { status: 200 });
  }
  // if (!user) {
  //   const newUser = new UserModel({
  //     _id: userId,
  //     // userName: ,
  //     favouritePlayers: [],
  //     favouriteTournaments: [], // Ensure correct field name
  //   });
  //   await newUser.save();
  // }

  const tournaments = await TournamentModel.find({});

  const result = user.favouritePlayers.map((player: TPlayer) => {
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

    return {
      ...player,
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

  const { playerId, username, action } = await req.json();
  let user = await UserModel.findById(userId).populate("favouritePlayers");

  if (!user) {
    user = new UserModel({
      _id: userId,
      userName: username,
      favouritePlayers: [playerId],
      favouriteTournaments: [],
    });
    await user.save();
    return NextResponse.json(user.favouritePlayers); // Return updated favoritePlayers
  }

  // Toggle logic - check the action type
  if (action === "remove") {
    // If the player is in the favouritePlayers array, remove them using $pull
    if (user.favouritePlayers.some((id) => id.equals(playerId))) {
      user.favouritePlayers.pull(playerId); // This removes the playerId from the array
      await user.save();
      return NextResponse.json({ message: "Player removed from favourites", user });
    } else {
      return NextResponse.json({ message: "Player not found in favourites" }, { status: 404 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
