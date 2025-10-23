import { EmailAddress } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, unique: true },
    username: { type: String, required: true },
    emailAddress: { type: String },
    phoneNumber: { type: String },
    favouritePlayers: [{ type: mongoose.Types.ObjectId, ref: "PlayerModel" }],
    favouriteTournaments: [{ type: mongoose.Types.ObjectId, ref: "TournamentModel" }],
    userNotification: { type: Boolean, default: false },
  },
  { collection: "users" }
);

export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
