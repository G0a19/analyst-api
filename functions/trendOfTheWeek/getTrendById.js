const httpError = require("./../shared/httpError");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");

const getTrendById = async function (req, res, next) {
  const { id } = req.params;
  if (!id) return httpError(res, "No id found", 404);

  let currentTrend;
  try {
    currentTrend = await TrendOfTheWeek.findById(id);
  } catch (err) {
    console.log(err);
    return httpError(res, "No trend found", 404);
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

module.exports = getTrendById;
