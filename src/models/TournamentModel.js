import mongoose from "mongoose";
import {playerSchema} from "./PlayerModel";
// import {queueSchema} from "./QueueModel.js";
const tournamentSchema = new mongoose.Schema(
  {
    // _id: String,
    name: {type: String, required: true},
    categories: [{type: String, required: true}],
    adminUser: String,
    image: {type: String},
    description: {type: String},
    // NEW:
    unProcessedQItems: [playerSchema],
    processedQItems: [playerSchema],
    queues: {
      queueName: String,
      queueItems: [playerSchema]
    }
  },
  {collection: "tournaments"}
);

const TournamentModel =
  mongoose.models.TournamentModel ||
  mongoose.model("TournamentModel", tournamentSchema);

export default TournamentModel;
