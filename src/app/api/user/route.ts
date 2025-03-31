import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { username, id } = await req.json();
    // const userId = getAuth(req);

    console.log("userID", id);
    console.log("userName", username);

    if (!id || !username) {
      return NextResponse.json({ error: "Missing id or username" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      // Create new user
      const newUser = new UserModel({
        _id: id,
        userName: username,
        favouritePlayers: [],
        favouriteTournaments: [],
      });
      await newUser.save();

      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
