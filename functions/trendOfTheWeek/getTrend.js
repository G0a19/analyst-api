const httpError = require("./../shared/httpError");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");

const getTrend = async function (req, res, next) {
  const { tredtype } = req.params;
  if (!tredtype) return httpError(res, "No trend found", 404);

  let currentTrend;
  try {
    currentTrend = await TrendOfTheWeek.findOne({ type: tredtype });
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentTrend) return httpError(res, "No trend found", 404);

  let fixedTrend = [];

  currentTrend.stocks.forEach((stock) => {
    const stockObj = {
      stockName: stock.stockName,
      stockId: stock.stockId,
      numberOfVotes: stock.users.length,
    };
    fixedTrend.push(stockObj);
  });

  return res.status(201).json(fixedTrend);
};

module.exports = getTrend;
