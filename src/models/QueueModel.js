import mongoose from "mongoose";
import { playerSchema } from "./PlayerModel.js";

export const queueSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId },
  queueName: { type: String, required: true },
  // used to have ref: "PlayerModel"
  queueItems: [playerSchema],
});

const QueueModel = mongoose.models.QueueModel || mongoose.model("QueueModel", queueSchema);

export default QueueModel;
