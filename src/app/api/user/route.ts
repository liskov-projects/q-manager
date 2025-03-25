// // SAVES USER INTO USER COLLECTION
// import dbConnect from "@/lib/db";
// import { getAuth } from "@clerk/nextjs/server";

// export default async function POST(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }
//   const { userId } = getAuth(req);

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorised" });
//   }

//   await dbConnect();

//   const existingUser = await db.collection("users").findOne({ _id: userId });
//   if (!existingUser) {
//     await dbConnect.;
//   }
// }
