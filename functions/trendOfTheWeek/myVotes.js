const httpError = require("./../shared/httpError");
const Stocks = require("./../../mongodb/stock");
const User = require("./../../mongodb/user");
const Vote = require("./../../mongodb/vote");

const myVotes = async function (req, res, next) {
  if (!req.params.userid) httpError(res, "No user found", 404);
  try {
    existsUser = await User.findById(req.params.userid);
  } catch (err) {
    console.log(err);
    return httpError(res, "No user found", 404);
  }

  const votes = [];
  try {
    for (
      let voteNumber = 0;
      voteNumber < existsUser.votes.length;
      voteNumber++
    ) {
      const currentVote = await Vote.findById(existsUser.votes[voteNumber]);
      const currentStock = await Stocks.findById(currentVote.stockId);
      votes.push({
        id: currentStock.id,
        voteName: currentStock.name,
        type: currentStock.type,
      });
    }
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  return res.status(201).json({ votes: votes });
};

module.exports = myVotes;
