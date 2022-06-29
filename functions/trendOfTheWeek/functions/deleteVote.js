const httpError = require("../../shared/httpError");
const mongoose = require("mongoose");
const TrendOfTheWeek = require("../../../mongodb/trendOfTheWeek");
const Stocks = require("../../../mongodb/stock");
const User = require("../../../mongodb/user");
const Vote = require("../../../mongodb/vote");

const deleteVote = async function (
  currentVote,
  currectUser,
  currectTrend,
  res
) {
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await currectUser.save();
    await currectTrend.save();
    await currentVote.remove();
  } catch (err) {
    console.log(err);
    return httpError(res, "Delete failed", 404);
  }
};

module.exports = deleteVote;
