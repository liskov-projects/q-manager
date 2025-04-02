import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { username, phoneNumber } = await req.json();
  const { userId } = getAuth(req);

  // checks existing user
  const existingUser = await UserModel.findById(userId);

  if (!existingUser) {
    // creates a new one
    const newUser = new UserModel({
      _id: userId,
      userName: username,
      phoneNumber: phoneNumber,
      favouritePlayers: [],
      favouriteTournaments: [],
    });
    await newUser.save();
    console.log("NEW USER");
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } else {
    console.log("EXISTING USER");
    return NextResponse.json({ message: "User  exists" }, { status: 409 });
  }
}
