import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  names: {type: [String], required: true},
  category: {type: String, required: true},
  phoneNumbers: [{type: String, required: true}]
});

const Player = mongoose.models.Player || mongoose.model("Player", playerSchema);
export default Player;
