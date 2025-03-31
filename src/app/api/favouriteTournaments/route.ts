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

  // finds the user and gets favouriteTournaments arr as ObjectId[]
  const user = await UserModel.findById(userId)
    .populate({
      path: "favouriteTournaments",
      select: "_id name categories",
    })
    .lean();

  // mongo scans the collection looking for the items that match the provided condition/data/pattern
  const favouriteTournaments = await TournamentModel.find({
    _id: { $in: user.favouriteTournaments },
  });

  return NextResponse.json(favouriteTournaments);
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tournamentId, username } = await req.json();
  console.log("username", username);

  const user = await UserModel.findById(userId).populate("favouriteTournaments");

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const tournament = await TournamentModel.findById(tournamentId);
  if (!tournament) {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  }
  if (user.favouriteTournaments.some((item: string) => item.toString() === tournamentId))
    NextResponse.json({ message: "Tournament already in the list" }, { status: 200 });

  user.favouriteTournaments.push(tournamentId);
  await user.save();
  return NextResponse.json(user.favouriteTournaments);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  // gets the userId from the authentication
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tournamentId } = await req.json();
  // console.log(tournamentId);
  const user = await UserModel.findById(userId).populate("favouriteTournaments");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // checks for the player
  const index = user.favouriteTournaments.findIndex((item: TTournament) => {
    // console.log("id", item);
    return item._id.toString() === tournamentId;
  });

  if (index === -1) {
    return NextResponse.json({ message: "Tournament not found in favourites" }, { status: 404 });
  }

  // removes tournamentId from the array
  user.favouriteTournaments.pull(tournamentId);
  await user.save();

  return NextResponse.json({ message: "Tournament removed from favourites", user });
}
