import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    tournamenName: {type: String, required: true},
    categories: [{type: String, required: true}],
    image: {type: Buffer},
    description: {type: String},
    //   can't directly refer other models | use this:
    queues: [{type: mongoose.Schema.Types.ObjectId, ref: "QueueModel"}],
    players: [{type: mongoose.Schema.Types.ObjectId, ref: "PlayerModel"}]
  },
  {collection: "tournaments"}
);

const TournamentModel =
  mongoose.models.TournamentModel ||
  mongoose.model("TournamentModel", tournamentSchema);

export default TournamentModel;
