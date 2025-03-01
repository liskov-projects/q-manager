import {TournamentModel} from "@/models/TournamentModel";
import dbConnect from "@/lib/db";
import {QueueModel} from "@/models/QueueModel";
import {NextRequest} from "next/server";

export async function GET() {
  await dbConnect();
  const queues = await TournamentModel.aggregate([
    {
      $group: {
        _id: "$tournamentId",
        queues: {$push: "$$ROOT"}
      }
    },
    {
      $lookup: {
        from: "tournaments",
        localField: "_id",
        as: "tournamentDetails"
      }
    }
  ]);
  console.log("QUEUES");
  console.log(queues);
  return new Response(JSON.stringify(queues), {
    headers: {"Content-Type": "application/json"}
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  // console.log("Recieved at backend: ", body);
  // handles incoming JSON
  const {queueName, queueItems} = body;

  // NEW:
  // const tournament = await TournamentModel.find({_id: new Object(tournamentId)});
  //
  // console.log("Names: ", names);
  // console.log("Categories: ", categories);
  // console.log("phoneNumbers: ", phoneNumbers);
  // console.log("at the back ", tournamentId);
  // creates a new entry using the incoming data
  const newQueue = new QueueModel({
    queueName,
    queueItems
  });

  // saves to db
  await newQueue.save();

  // Response - NextJS constructor that sends data to from server to client
  return new Response(JSON.stringify(newQueue), {
    headers: {"Content-Type": "application/json"}
  });
}

// import mongoose from "mongoose";
// import Tournament from "@/models/Tournament"; // Your Mongoose model

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { tournamentId, queueName, newItem } = req.body;

//     try {
//       // Find the tournament and update the specified queue
// const updatedTournament = await Tournament.findOneAndUpdate(
//         { _id: tournamentId, "queues.queueName": queueName },
//         { $push: { "queues.$.queueItems": newItem } }, // $ is a positional operator
//         { new: true } // Returns the updated document
//       );

//       if (!updatedTournament) {
//         return res.status(404).json({ message: "Tournament or queue not found" });
//       }

//       res.status(200).json({ message: "Item added successfully", updatedTournament });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }
