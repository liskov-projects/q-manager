import mongoose from "mongoose";

export const queueSchema = new mongoose.Schema({
  queueName: {type: String, required: true},
  queueItems: [{type: mongoose.Schema.Types.ObjectId, ref: "PlayerModel"}]
});

const QueueModel =
  mongoose.models.QueueModel || mongoose.model("QueueModel", queueSchema);

export default QueueModel;
