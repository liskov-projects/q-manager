import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ _id: userId });

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

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { username, phoneNumber } = await req.json();
    const auth = getAuth(req);
    const id = auth.userId;

    // if (!id || !username) {
    //   return NextResponse.json({ error: "Missing id or username" }, { status: 400 });
    // }

    // Check if user already exists
    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      // Create new user
      const newUser = new UserModel({
        _id: id,
        userName: username,
        phoneNumber: phoneNumber,
        favouritePlayers: [],
        favouriteTournaments: [],
      });
      await newUser.save();

      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      );
    } else {
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
