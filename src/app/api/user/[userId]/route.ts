import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { id } = req;

    if (!id) {
      return NextResponse.json({ error: "Needs user ID" }, { status: 401 });
    }

    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else {
      // const result = user.toObject({ getters: true });
      return NextResponse.json(user, { status: 200 }); //returns accepted status
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// WORKS: as expected
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
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
      // updates the user info
      existingUser.username = username;
      existingUser.phoneNumber = phoneNumber;
      existingUser.save();
      return NextResponse.json({ message: "User updated", user: existingUser }, { status: 200 });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
