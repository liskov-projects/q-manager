import Tournament from "@/components/Tournaments/TournamentCard";
import dbConnect from "@/lib/db";
// import PlayerModel from "@/models/PlayerModel";
import TournamentModel from "@/models/TournamentModel";
import {NextRequest} from "next/server";
import findPlayerInTournament from "../../utilities/findPlayerInTournament";

export async function PUT(request: NextRequest, {params}) {
  console.log("params are: ", params);

  const playerId = params.player;
  const {tournamentID, ...body} = await request.json();

  console.log("tournamentID: ", tournamentID);
  console.log("body: ", body);

  try {
    await dbConnect();

    const tournamentToUpdate = await TournamentModel.findOne({_id: tournamentID});
    console.log("tournamentToUpdate: ", tournamentToUpdate);

    const foundPlayer = findPlayerInTournament(tournamentToUpdate, playerId);
    console.log("foundPlayer: ", foundPlayer);

    const updatedPlayer = await TournamentModel.findOneAndUpdate(
      {_id: id}, // Match by MongoDB ObjectId
      {...body}, // Update
      {new: true} // Return the updated document
    );

    if (!updatedPlayer) {
      return new Response(JSON.stringify({error: "Player not found"}), {
        status: 404,
        headers: {"Content-Type": "application/json"}
      });
    }

    return new Response(JSON.stringify(updatedPlayer), {
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
