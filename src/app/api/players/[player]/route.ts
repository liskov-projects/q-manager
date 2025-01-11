import mongoose from "mongoose";

import dbConnect from "@/lib/db";
// models
import PlayerModel from "@/models/PlayerModel";
import TournamentModel from "@/models/TournamentModel";
//
import {NextRequest} from "next/server";

export async function PUT(request: NextRequest) {
  const {tournamentID, ...player} = await request.json();

  // WORKS:
  // console.log("tournamentID: ", tournamentID);
  // console.log("PLAYER: ", player);

  try {
    await dbConnect();

    // const playerObjectId = new mongoose.Types.ObjectId(player._id);

    const updatedPlayer = await PlayerModel.findOneAndUpdate(
      {_id: player._id}, // Match by MongoDB ObjectId
      {...player}, // Update
      // FIXME: does it work?
      {new: true} // Return the updated document
    );

    // console.log("playerObjectId", playerObjectId);
    // console.log("player to update: ", updatedPlayer);
    // console.log("tournament to update: ", tournamentToUpdate);

    // find the tournament for the updated player
    // Update the player inside the tournament's players array
    const updatedTournament = await TournamentModel.findOneAndUpdate(
      {_id: tournamentID, "unProcessedQItems._id": updatedPlayer._id},

      {$set: {"unProcessedQItems.$": updatedPlayer}},
      {new: true} // Return the updated tournament document
    );

    // WORKS:
    // console.log("tournament to update ", updatedTournament);

    return new Response(JSON.stringify(updatedTournament), {
      status: 200,
      headers: {"Content-Type": "application/json"}
    });
  } catch (error) {
    console.error("Error updating player: ", error);
    return new Response(JSON.stringify({error: "Failed to update player"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    });
  }
}

export async function DELETE(request: NextRequest) {
  const idToDelete = request.body._id;

  try {
    await dbConnect();

    const deletedItem = await PlayerModel.findOneAndDelete({idToDelete});

    if (!deletedItem) {
      return new Response(JSON.stringify({error: "Player not found"}), {
        status: 404,
        headers: {"Content-Type": "application/json"}
      });
    }

    return new Response(JSON.stringify({message: "Deleted successfully"}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error deleting player:", error);
    return new Response(JSON.stringify({error: "Failed to delete player"}), {
      status: 500,
      headers: {"Content-Type": "application/json"}
    });
  }
}
