const httpError = require("./../shared/httpError");
const Stocks = require("./../../mongodb/stock");
const User = require("./../../mongodb/user");
const Vote = require("./../../mongodb/vote");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");
const deleteVote = require("./functions/deleteVote");

const deleteMyVote = async function (req, res, next) {
  const voteId = req.params.voteid;
  if (!voteId) return httpError(res, "No vote found", 404);

  let currentVote;
  try {
    currentVote = await Vote.findById(voteId);
  } catch (err) {
    console.log(err);
    return httpError(res, "No vote found", 404);
  }
  if (!currentVote) return httpError(res, "No vote found", 404);

  let currentStock;
  try {
    currentStock = await Stocks.findById(currentVote.stockId);
  } catch (err) {
    console.log(err);
    return httpError(res, "No Stock found", 404);
  }
  if (!currentVote) return httpError(res, "No Stock found", 404);

  let currectUser;
  try {
    currectUser = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    return httpError(res, "No user found", 404);
  }

  if (currentVote.userId != req.userData.userId)
    return httpError(res, "This user not allowed to delete the vote", 404);

  currectUser.votes = currectUser.votes.filter(
    (vote) => vote != currentVote.id
  );

  try {
    currectTrend = await TrendOfTheWeek.findById(currentVote.trendOfTheWeekId);
  } catch (err) {
    console.log(err);
    return httpError(res, "No trend found", 404);
  }

  if (!currectTrend) return httpError(res, "No trend found", 404);

  currectTrend.allUsers = currectTrend.allUsers.filter(
    (user) => user != req.userData.userId
  );

  const indexOfVote = currectTrend.stocks.findIndex(
    (stock) => stock.stockName === currentStock.name
  );
  if (indexOfVote === -1) return httpError(res, "No stock found", 404);

  currectTrend.stocks[indexOfVote].users = currectTrend.stocks[
    indexOfVote
  ].users.filter((user) => user != req.userData.userId);

  await deleteVote(currentVote, currectUser, currectTrend);

  return res.status(201).json({ massage: "The deletion was successful" });
};

module.exports = deleteMyVote;
