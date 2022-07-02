const httpError = require("./../shared/httpError");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");

const getAllTrendTypes = async function (req, res, next) {
  let currentTrends;
  try {
    currentTrends = await TrendOfTheWeek.find();
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (currentTrends) {
    currentTrends = currentTrends.filter(
      (trend) => !trend.type.includes("no active")
    );
    currentTrends = currentTrends.map((trend) => trend.type);
  }

  return res.status(201).json(currentTrends);
};

module.exports = getAllTrendTypes;
