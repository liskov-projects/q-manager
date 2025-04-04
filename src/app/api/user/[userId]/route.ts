import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { username, phoneNumber } = await req.json();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let user = await UserModel.findById(userId);

    if (!user) {
      user = new UserModel({
        _id: userId,
        userName: username,
        phoneNumber,
        favouritePlayers: [],
        favouriteTournaments: [],
      });
      await user.save();
      return NextResponse.json(user, { status: 201 });
    } else {
      // console.log("CHANGING USER DATA");
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { username, phoneNumber },
        { new: true } // Return updated doc
      );
      // console.log("Updated user:", updatedUser);
      return NextResponse.json(updatedUser, { status: 200 });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { username, phoneNumber } = await req.json();
    const { userId } = getAuth(req);
    console.log(username);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User doesn't exist" }, { status: 404 });
    } else {
      // console.log("CHANGING USER DATA");
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { userName: username, phoneNumber: phoneNumber },
        { new: true, runValidators: true }
      );
      console.log("Updated user:", updatedUser);
      return NextResponse.json(updatedUser, { status: 200 });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}
