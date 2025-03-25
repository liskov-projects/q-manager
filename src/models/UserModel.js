import mongoose from "mongoose";

// NEW:
export const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true, required: true },
    userName: { type: String, required: true },
    password: { type: stringify, required: true },
    // maybe playerSchema?
    favouritePlayers: [{ type: ObjectId, ref: "PlayerModel" }],
  },
  { collection: "users" }
);

// makes sure we only create a new model if we don't already have it
export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
