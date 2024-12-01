import dbConnect from "@/lib/db";
import PlayerModel from "@/models/PlayerModel";
import {NextRequest} from "next/server";

export async function PUT(request: NextRequest, {params}) {
  console.log("PUT request hit");
  // console.log("params: ", params);
  // console.log("params content: ", params.player);

  const id = params.player;
  const body = await request.json();

  // console.log("Player ID:", id);
  // console.log("Request body:", body);

  try {
    await dbConnect();
    // Simulate update logic
    const updatedPlayer = await PlayerModel.findOneAndUpdate(
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
  console.log("ENTERS DELETE");
  console.log("request: ", request);

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
