const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  trendOfTheWeekId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "TrendOfTheWeek",
  },
  stockId: { type: mongoose.Types.ObjectId, required: true, ref: "Stock" },
});

module.exports = mongoose.model("Vote", voteSchema);
