import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  console.log("📥 Incoming POST /api/user");

  try {
    const body = await req.json();
    const { username, clerkId, usedFallback, emailAddress } = body;

    console.log("📦 Body received:", { clerkId, username, usedFallback, emailAddress });

    if (!clerkId || typeof clerkId !== "string") {
      return NextResponse.json({ error: "Missing or invalid Clerk ID" }, { status: 400 });
    }

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Missing or invalid username" }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ clerkId });

    if (existingUser) {
      console.log("👤 Existing user found:", existingUser.username);
      return NextResponse.json(existingUser);
    }

    const newUser = new UserModel({
      clerkId,
      username,
      emailAddress,
      favouritePlayers: [],
      favouriteTournaments: [],
    });

    await newUser.save();

    console.log("✅ New user created:", newUser.username);
    return NextResponse.json(newUser);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
