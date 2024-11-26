import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    // _id: String,
    name: {type: String, required: true},
    categories: [{type: String, required: true}],
    adminUser: String,
    image: {type: String},
    description: {type: String},
    queues: {type: Number}
  },
  {collection: "tournaments"}
);

const TournamentModel =
  mongoose.models.TournamentModel ||
  mongoose.model("TournamentModel", tournamentSchema);

export default TournamentModel;
