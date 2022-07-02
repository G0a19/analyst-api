const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const Vote = require("./../../mongodb/vote");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");
const Stocks = require("./../../mongodb/stock");
const deleteVote = require("./../trendOfTheWeek/functions/deleteVote");

const deleteUser = async function (req, res, next) {
  const id = req.userData.userId;

  let currentUser;
  try {
    currentUser = await User.findById(id);
  } catch (err) {
    console.log(err);
    return httpError(res, "No user found", 404);
  }
  if (!currentUser) return httpError(res, "No user found", 404);

  let currentVote;
  let currectTrend;
  let currentStock;

  for (
    numberOfVote = 0;
    numberOfVote < currentUser.votes.length;
    numberOfVote++
  ) {
    try {
      currentVote = await Vote.findById(currentUser.votes[numberOfVote]);
    } catch (err) {
      console.log(err);
      return httpError(res, "No vote found", 404);
    }
    if (!currentVote) return httpError(res, "No vote found", 404);

    try {
      currentStock = await Stocks.findById(currentVote.stockId);
    } catch (err) {
      console.log(err);
      return httpError(res, "No Stock found", 404);
    }
    if (!currentVote) return httpError(res, "No Stock found", 404);

    try {
      currectTrend = await TrendOfTheWeek.findById(
        currentVote.trendOfTheWeekId
      );
    } catch (err) {
      console.log(err);
      return httpError(res, "No trend found", 404);
    }
    if (!currectTrend) return httpError(res, "No trend found", 404);

    currentUser.votes = currentUser.votes.pull(currentUser.votes[numberOfVote]);
    currectTrend.allUsers = currectTrend.allUsers.pull(id);
    const indexOfVote = currectTrend.stocks.findIndex(
      (stock) => stock.stockName === currentStock.name
    );
    if (indexOfVote === -1) return httpError(res, "No stock found", 404);

    currectTrend.stocks[indexOfVote].users =
      currectTrend.stocks[indexOfVote].users.pull(id);

    await deleteVote(currentVote, currentUser, currectTrend, res);
  }

  try {
    await currentUser.delete();
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  return res.status(201).json({ massage: "successful" });
};

module.exports = deleteUser;
