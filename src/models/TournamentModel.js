import mongoose from "mongoose";

import {queueSchema} from "./QueueModel.js";
const tournamentSchema = new mongoose.Schema(
  {
    // _id: String,
    name: {type: String, required: true},
    categories: [{type: String, required: true}],
    adminUser: String,
    image: {type: String},
    description: {type: String},
    queues: [queueSchema]
    // queues: [{type: mongoose.Schema.Types.ObjectId, ref: "QueueModel"}]
  },
  {collection: "tournaments"}
);

const TournamentModel =
  mongoose.models.TournamentModel ||
  mongoose.model("TournamentModel", tournamentSchema);

export default TournamentModel;
