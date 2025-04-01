import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    // clerkId: { type: String },
    userName: { type: String, required: true },
    // password: { type: String, required: true },
    // maybe playerSchema?
    phoneNumber: { type: String, required: true },
    favouritePlayers: [{ type: mongoose.Types.ObjectId, ref: "PlayerModel" }],
    favouriteTournaments: [{ type: mongoose.Types.ObjectId, ref: "TournamentModel" }],
  },
  { collection: "users" }
);

// makes sure we only create a new model if we don't already have it
export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
