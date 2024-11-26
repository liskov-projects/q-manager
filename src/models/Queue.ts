import mongoose from "mongoose";
import PlayerModel from "./PlayerModel";

const queueSchema = new mongoose.Schema({
  queueName: {type: String, required: true},
  queueItems: [{type: PlayerModel}]
});
const QueueModel =
  mongoose.models.QueueModel || mongoose.model("QueueModel", queueSchema);
export default QueueModel;
