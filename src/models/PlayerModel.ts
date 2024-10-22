import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    names: {type: String, required: true},
    categories: [{type: String, required: true}],
    phoneNumbers: [{type: String, required: true}]
    // FIXME: assigned to queues & processed through queues
  },
  {collection: "players"}
);

// makes sure we only create a new model if we don't already have it
const PlayerModel =
  mongoose.models.PlayerModel || mongoose.model("PlayerModel", playerSchema);

export default PlayerModel;
