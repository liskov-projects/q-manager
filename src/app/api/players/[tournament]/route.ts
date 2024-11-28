import PlayerModel from "@/models/PlayerModel";
import dbConnect from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  console.log("MADE IT INTO THE GET FOR TOURNAMENT PLAYERS")
  console.log(req.url)
  // const { tournamentId } = req.url;

  // Ensure the database is connected
  await dbConnect();

  // if (req.method === "GET") {
  //   try {
      // Fetch players associated with the tournament ID
      // const players = await PlayerModel.find({ tournamentId });
      // if (!players) {
      //   return res.status(404).json({ message: "No players found for this tournament." });
      // }

  //     res.status(200).json(players);
  //   } catch (error) {
  //     console.error("Error fetching players:", error);
  //     res.status(500).json({ message: "Server error fetching players." });
  //   }
  // } else {
  //   res.setHeader("Allow", ["GET"]);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
