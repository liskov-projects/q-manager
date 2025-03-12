import mongoose from "mongoose";

export const playerSchema = new mongoose.Schema(
  //   FIXME: singular/plural
  {
    _id: { type: mongoose.Types.ObjectId, auto: true, required: true },
    names: { type: String, required: true },
    categories: [{ type: String, required: true }],
    phoneNumbers: [{ type: String, required: true }],
    tournamentId: {
      // used to refer this field to tournament._id
      type: String,
      required: true,
    },
  },
  { collection: "players" }
);

// makes sure we only create a new model if we don't already have it
export const PlayerModel =
  mongoose.models.PlayerModel || mongoose.model("PlayerModel", playerSchema);
