import dbConnect from "@/lib/db";
import Player from "@/models/PlayerModel";

export async function GET() {
  await dbConnect();
  const players = await Player.find({});
  console.log("PLAYERS");
  console.log(players);
  return new Response(JSON.stringify(players), {
    headers: {"Content-Type": "application/json"}
  });
}

/*With the current structure of a players object */
// export async function POST(req) {
//   await dbConnect();

//   const {names, category, phoneNumbers} = await req.json;
//   const newPayer = new PlayerModel({names, category, phoneNumbers});
//   await newPayer.save();

//   return new Response(JSON.stringify(newPayer), {
//     headers: {"Content-Type": "application/json"}
//   });
// }
