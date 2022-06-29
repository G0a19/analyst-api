const httpError = require("./../shared/httpError");
const mongoose = require("mongoose");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");
const Stocks = require("./../../mongodb/stock");
const User = require("./../../mongodb/user");
const Vote = require("./../../mongodb/vote");

const createNewTrend = require("./functions/createNewTrend");

const vote = async function (req, res, next) {
  const { type, stockId } = req.body;

  if (!type) return httpError(res, "No type found", 404);
  if (!stockId) return httpError(res, "No stock id found", 404);

  let existsTrendOfTheWeek;
  try {
    existsTrendOfTheWeek = await TrendOfTheWeek.findOne({ type: type });
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  let existsStock;
  try {
    existsStock = await Stocks.findById(stockId);
  } catch (err) {
    return httpError(res, "No stock found", 404);
  }

  let existsUser;
  try {
    existsUser = await User.findById(req.userData.userId);
  } catch (err) {
    return httpError(res, "No user found", 404);
  }

  let newTrendOfTheWeek = false;
  let newVote = new Vote({
    userId: existsUser.id,
    stockId: existsStock.id,
  });

  if (existsStock.type !== type)
    return httpError(res, "The trend no match with the stock", 404);

  if (!existsTrendOfTheWeek) {
    newTrendOfTheWeek = new TrendOfTheWeek({
      type: type,
      date: new Date().toISOString(),
      allUsers: [existsUser.id],
      stocks: [
        {
          stockName: existsStock.name,
          stockId: existsStock.id,
          users: [existsUser.id],
        },
      ],
    });

    newVote.trendOfTheWeekId = newTrendOfTheWeek.id;
  }

  if (newTrendOfTheWeek) {
    return await createNewTrend(newTrendOfTheWeek, newVote, existsUser, res);
  }

  const today = new Date();
  if (
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) <
    new Date(existsTrendOfTheWeek.date)
  ) {
    existsTrendOfTheWeek.type = existsTrendOfTheWeek.type + " not active";
    newTrendOfTheWeek = new TrendOfTheWeek({
      type: type,
      date: new Date().toISOString(),
      allUsers: [existsUser.id],
      stocks: [
        {
          stockName: existsStock.name,
          stockId: existsStock.id,
          users: [existsUser.id],
        },
      ],
    });
    newVote.trendOfTheWeekId = newTrendOfTheWeek.id;

    try {
      await existsTrendOfTheWeek.save();
      return await createNewTrend(newTrendOfTheWeek, newVote, existsUser, res);
    } catch (err) {
      console.log(err);
      return httpError(res, "Something went wrong please try again later", 404);
    }
  }

  const userIsThere = existsTrendOfTheWeek.allUsers.find(
    (user) => user == existsUser.id
  );
  if (userIsThere) return httpError(res, "User is already vote", 404);

  const stocksIsExists = existsTrendOfTheWeek.stocks.findIndex(
    (stock) => stockId == stock.stockId
  );

  if (stocksIsExists !== -1) {
    const stocks = existsTrendOfTheWeek.stocks[stocksIsExists];
    newVote.trendOfTheWeekId = existsTrendOfTheWeek.id;

    existsTrendOfTheWeek.allUsers.push(existsUser.id);
    return await createNewTrend(
      existsTrendOfTheWeek,
      newVote,
      existsUser,
      res,
      true,
      stocksIsExists
    );
  }

  existsTrendOfTheWeek.stocks.push({
    stockName: existsStock.name,
    stockId: existsStock.id,
    users: [existsUser.id],
  });
  existsTrendOfTheWeek.allUsers.push(existsUser.id);
  newVote.trendOfTheWeekId = existsTrendOfTheWeek.id;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await existsTrendOfTheWeek.save();
    await newVote.save();
    existsUser.votes.push(newVote);
    await existsUser.save();
    await sess.commitTransaction();
    return res.status(201).json({ newTrendOfTheWeek: existsTrendOfTheWeek });
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }
};

module.exports = vote;
