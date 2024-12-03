import mongoose from "mongoose";

export const queueSchema = new mongoose.Schema({
  queueName: {type: String, required: true},
  // used to have ref: "PlayerModel"
  queueItems: [{type: mongoose.Schema.Types.ObjectId}]
});

const QueueModel =
  mongoose.models.QueueModel || mongoose.model("QueueModel", queueSchema);

export default QueueModel;
