import PlayerModel from "@/models/PlayerModel";
import dbConnect from "@/lib/db";
// for older version
// import type {NextApiRequest, NextApiResponse} from "next";
// new version
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
  // console.log("MADE IT INTO THE GET FOR TOURNAMENT PLAYERS");
  // console.log("this is REQ: ", req);
  const {url} = req;
  console.log(typeof url);

  const tournamentId = url?.split("/").pop();
  // console.log(tournamentId);
  // Ensure the database is connected
  await dbConnect();

  // already have GET
  // if (req.method === "GET") {
  try {
    // Fetch players associated with the tournament ID
    const players = await PlayerModel.find({tournamentId});
    if (!players || players.length === 0) {
      console.error("No players");
      //  res.status(404).json({message: "No players found for this tournament."});
    }

    return new Response(JSON.stringify(players), {
      status: 200,
      headers: {"Content-Type": "application/json"}
    });
    // res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    // res.status(500).json({message: "Server error fetching players."});
  }
  // } else {
  //   res.setHeader("Allow", ["GET"]);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
