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

  // console.log("this is req in POST", req);

  //  automatically gets userID so we don't need the forlder [...id]
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playerId, username } = await req.json();

  // console.log("req", playerId, username);

  let user = await UserModel.findById(userId).populate("favouritePlayers"); //.lean();

  if (!user) {
    user = new UserModel({
      _id: userId,
      userName: username,
      favouritePlayers: [playerId],
      favouriteTournaments: [],
    });
    await user.save();
    // return earlier as we don't need the rest of the function in this case
    return NextResponse.json(user.favouritePlayers);
  }

  // ensures the reference is read ok
  const playerObjectId = new mongoose.Types.ObjectId(playerId);

  // gets all tournaments
  const tournaments = await TournamentModel.find({});
  // console.log("TOURNAments", tournaments);
  // looks up the player and gives them a tournament name
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
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          favouritePlayers: {
            $cond: {
              if: { $in: [playerObjectId, "$favouritePlayers"] },
              then: { $setDifference: ["$favouritePlayers", [playerObjectId]] },
              else: { $concatArrays: ["$favouritePlayers", [playerObjectId]] },
            },
          },
        },
      },
    ],
    { new: true }
  );
  return NextResponse.json(updatedUser.favouritePlayers);
}
