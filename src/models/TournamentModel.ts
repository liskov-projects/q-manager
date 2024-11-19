import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    categories: [{type: String, required: true}],
    adminUser: String,
    image: {type: String},
    description: {type: String},
    //   can't directly refer other models | use this:
    queues: {type: Number}
    // players: [{type: mongoose.Schema.Types.ObjectId, ref: "PlayerModel"}]
  },
  {collection: "tournaments"}
);

const TournamentModel =
  mongoose.models.TournamentModel ||
  mongoose.model("TournamentModel", tournamentSchema);

export default TournamentModel;
