import { TournamentModel } from "@/models/TournamentModel";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET - Fetch a single tournament
export async function GET(req: NextRequest, { params }: { params: { tournamentId: string } }) {
  console.log("🎯 Fetching tournament from API...");

  const tournamentId = params.tournamentId; // ✅ Extract from route parameters
  console.log("✅ Extracted tournament ID:", tournamentId);

  if (!tournamentId) {
    return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
  }

  await dbConnect();

  try {
    const tournament = await TournamentModel.findById(tournamentId);

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    console.log("✅ Tournament fetched:", tournament);
    return NextResponse.json(tournament, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching tournament:", error);
    return NextResponse.json({ error: "Failed to fetch tournament" }, { status: 500 });
  }
}

// ✅ PUT - Update a single tournament
export async function PUT(req: NextRequest, { params }: { params: { tournamentId: string } }) {
  const tournamentId = params.tournamentId; // ✅ Extract from route parameters
  console.log("✏️ Updating tournament:", tournamentId);

  if (!tournamentId) {
    return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    console.log("🔄 Update body:", body);

    // ✅ Update tournament
    const updatedTournament = await TournamentModel.findByIdAndUpdate(tournamentId, body, {
      new: true,
    });

    if (!updatedTournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // ✅ Fetch updated tournament with populated data
    const savedTournament = await TournamentModel.findById(tournamentId).populate({
      path: "queues.queueItems",
      model: "PlayerModel",
    });

    console.log("✅ Updated Tournament:", savedTournament);

    return NextResponse.json(savedTournament, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating tournament:", error);
    return NextResponse.json({ error: "Failed to update tournament" }, { status: 500 });
  }
}
