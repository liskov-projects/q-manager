import { NextRequest, NextResponse } from "next/server";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/UserModel";

export async function GET(req: NextRequest) {
  await dbConnect();

  //  automatically gets userID so we don't need the forlder [...id]
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await UserModel.findById(userId).populate("favouritePlayers").lean();
  if (!user) {
    return NextResponse.json({ favouritePlayers: [] });
  }

  return NextResponse.json({ favouritePlayers: user.favouritePlayers });
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId } = getAuth(req);
  const userData = await currentUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { playerId } = await req.json();
  if (!playerId) {
    return NextResponse.json({ error: "Player ID required" }, { status: 400 });
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    await UserModel.create({
      _id: userId,
      userName: userData?.firstName,
      favouritePlayers: [playerId],
    });
    return NextResponse.json({ message: "Player added to favourites" });
  }

  const isFavourite = user.favouritePlayers.includes(playerId);

  await UserModel.updateOne(
    { _id: userId },
    isFavourite
      ? { $pull: { favouritePlayers: playerId } } // Remove if already there
      : { $addToSet: { favouritePlayers: playerId } } // Add if not there
  );

  return NextResponse.json({
    message: isFavourite ? "Player removed from favourites" : "Player added to favourites",
  });
}
