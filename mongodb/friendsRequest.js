const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendsRequestSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  reciver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  date: { type: String, required: true },
});

module.exports = mongoose.model("FriendsRequest", friendsRequestSchema);
