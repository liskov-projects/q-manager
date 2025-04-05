import { NextResponse, NextRequest } from "next/server";
import Papa from "papaparse";
import { TournamentModel } from "@/models/TournamentModel";
import dbConnect from "@/lib/db";

type DocumentRow = {
  first_name: string;
  phone: string;
  categories: string;
};

export async function POST(req: NextRequest) {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get("file");
  const tournamentId = formData.get("tournamentId");

  if (!file || !tournamentId) {
    return NextResponse.json({ error: "Missing file or tournamentId" }, { status: 400 });
  }

  const text = await file.text();

  // Parse the CSV
  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    return NextResponse.json({ error: "CSV parse error", details: errors }, { status: 400 });
  }

  if (!data.length) {
    return NextResponse.json({ error: "CSV is empty or malformed" }, { status: 400 });
  }

  // Validate headers
  const requiredHeaders = ["first_name", "phone", "categories"];
  const headers = Object.keys(data[0]);
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    return NextResponse.json(
      { error: "Missing required headers", missingHeaders },
      { status: 400 }
    );
  }

  // Sanitize & validate rows
  const players = data
    .filter((row: DocumentRow) => row.first_name && row.phone && row.categories)
    .map((row: DocumentRow) => ({
      names: row.first_name.trim(),
      phoneNumbers: row.phone.split(",").map((num) => num.trim()),
      categories: row.categories.split(",").map((cat) => cat.trim()),
      tournamentId,
    }));

  if (players.length === 0) {
    return NextResponse.json({ error: "No valid player rows found in CSV" }, { status: 400 });
  }

  try {
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $push: { unProcessedQItems: { $each: players } } },
      { new: true }
    );

    if (!updatedTournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Players imported", count: players.length });
  } catch (err) {
    return NextResponse.json({ error: "DB update failed", details: err.message }, { status: 500 });
  }
}
