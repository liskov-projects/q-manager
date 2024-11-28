import PlayerModel from "@/models/PlayerModel";
import dbConnect from "@/lib/db";
// for older version
// import type {NextApiRequest, NextApiResponse} from "next";
// new version
import {NextRequest, NextResponse} from "next/server";

// NOTE: move the POST here as well?
export async function GET(req: NextRequest) {
  // console.log("MADE IT INTO THE GET FOR TOURNAMENT PLAYERS");
  // console.log("this is REQ: ", req);
  const {url} = req;
  // console.log(typeof url);

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

export async function PUT(req: NextRequest, res: NextRequest) {
  await dbConnect();
  console.log(req);

  try {
    // ! OLD WAY
    // const { id, newData } = req.body; // ! OLD WAY
    // const dataOldWay = JSON.parse(request.body); // ! OLD WAY
    const {id, newData} = await req.json();
    console.log("id & newData: ", id, newData);
    const updatedPlayer = await PlayerModel.findByIdAndUpdate(id, newData, {
      new: true
    });

    if (!updatedPlayer) {
      console.log("error catch");

      return NextResponse.json({error: "Internal Server Error"}, {status: 500});
      // ! THE FOLLOWING DOES NOT WORK - will assume and return a status 200 response
      // return NextResponse.json({ error: 'Internal Server Error', status: 500 });
    }

    return NextResponse.json({updatedPlayer});
  } catch {
    return NextResponse.json(
      {error: "Catch Error - Internal Server Error"},
      {status: 500}
    );
  }
}
