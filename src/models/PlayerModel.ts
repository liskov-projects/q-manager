import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    id: {type: Number, required: true, unique: true},
    names: {type: String, required: true},
    category: {type: String, required: true},
    phoneNumbers: [{type: String, required: true}],
    assignedToQueue: {type: Boolean, required: true},
    processThroughQueue: {type: Boolean, required: true}
  },
  {collection: "players"}
);

// makes sure we only create a new model if we don't already have it
const PlayerModel =
  mongoose.models.PlayerModel || mongoose.model("PlayerModel", playerSchema);

export default PlayerModel;
