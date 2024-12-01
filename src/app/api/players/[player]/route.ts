import dbConnect from "@/lib/db";
import PlayerModel from "@/models/PlayerModel";

export async function PUT(request, {params}) {
  console.log("PUT request hit");
  console.log("params: ", params);
  console.log("params content: ", params.player);

  const id = params.player;
  const body = await request.json();

  console.log("Player ID:", id);
  console.log("Request body:", body);

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

    // FIXME: how to instantly get the fresh data?
    const allPlayers = await PlayerModel.find(); // Retrieve all players (or adjust query if needed)

    // Return the full updated list of players
    return new Response(JSON.stringify(allPlayers), {
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
