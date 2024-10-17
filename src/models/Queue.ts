import mongoose from "mongoose";
import Player from "./Player";

const queueSchema = new mongoose.Schema({
  queueName: {type: String, required: true},
  QueueItems: [{type: Player}],
  id: {type: String, required: true}
});
const Queue = mongoose.models.Queue || mongoose.model("Queue", queueSchema);
export default Queue;
