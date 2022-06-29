const mongoose = require("mongoose");
const httpError = require("../../shared/httpError");
const Stocks = require("../../../mongodb/stock");
const User = require("../../../mongodb/user");
const Vote = require("../../../mongodb/vote");

const createNewTrend = async function (
  newTrendOfTheWeek,
  newVote,
  existsUser,
  res,
  update = false,
  index = 0
) {
  if (update === false) {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await newTrendOfTheWeek.save();
      await newVote.save();
      existsUser.votes.push(newVote);
      await existsUser.save();
      await sess.commitTransaction();
      return res.status(201).json({ newTrendOfTheWeek: newTrendOfTheWeek });
    } catch (err) {
      console.log(err);
      return httpError(res, "Something went wrong please try again later", 404);
    }
  } else {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await newVote.save();
      newTrendOfTheWeek.stocks[index].users.push(existsUser.id);
      await newTrendOfTheWeek.save();
      existsUser.votes.push(newVote);
      await existsUser.save();
      return res.status(201).json({ TrendOfTheWeek: newTrendOfTheWeek });
    } catch (err) {
      console.log(err);
      return httpError(res, "Something went wrong please try again later", 404);
    }
  }
};

module.exports = createNewTrend;
