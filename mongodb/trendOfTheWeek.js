const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trendOfTheWeekSchema = new Schema({
  type: { type: String, required: true },
  date: { type: String, required: true },
  allUsers: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  stocks: [
    {
      stockName: { type: String, required: true },
      stockId: { type: String, required: true },
      users: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
    },
  ],
});

module.exports = mongoose.model("TrendOfTheWeek", trendOfTheWeekSchema);
