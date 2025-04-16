import mongoose from "mongoose";
import { playerSchema } from "./PlayerModel.js";
import { queueSchema } from "./QueueModel.js";

export const tournamentSchema = new mongoose.Schema(
  {
    // is it neede here?
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true, unique: true },
    categories: [{ type: String, required: true }],
    adminUser: String,
    image: { type: String },
    description: { type: String },
    unProcessedQItems: [playerSchema],
    processedQItems: [playerSchema],
    // queues: [{type: queueSchema, required: true, default: []}]
    queues: { type: [queueSchema], default: [] },
    eventDate: { type: Date },
  },
  { collection: "tournaments" }
);

export const TournamentModel =
  mongoose.models.TournamentModel || mongoose.model("TournamentModel", tournamentSchema);
