import mongoose from "mongoose";
import {playerSchema} from "./PlayerModel";

export const queueSchema = new mongoose.Schema({
  queueName: {type: String, required: true},
  // used to have ref: "PlayerModel"
  queueItems: [playerSchema]
});

const QueueModel =
  mongoose.models.QueueModel || mongoose.model("QueueModel", queueSchema);

export default QueueModel;
