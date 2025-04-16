import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  console.log("REQ IN POST");
  console.log(req);

  const { username } = await req.json();
  const { userId } = getAuth(req);

  // checks existing user
  const existingUser = await UserModel.findOne({ clerkId: userId });

  if (!existingUser) {
    // creates a new one
    const newUser = new UserModel({
      clerkId: userId,
      username: username,
      favouritePlayers: [],
      favouriteTournaments: [],
    });

    await newUser.save();
    console.log("NEW USER CREATED");
    console.log(newUser);

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } else {
    console.log("EXISTING USER");
    return NextResponse.json({ message: "User  exists" }, { status: 409 });
  }
}
