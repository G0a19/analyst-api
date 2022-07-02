const httpError = require("./../shared/httpError");
const TrendOfTheWeek = require("./../../mongodb/trendOfTheWeek");

const getDatesOfTrends = async function (req, res, next) {
  const { type } = req.params;
  if (!type) return httpError(res, "No type include", 404);

  let dataToSend = [];
  let currentTrends;
  try {
    currentTrends = await TrendOfTheWeek.find({ type: type });
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentTrends) return httpError(res, "No trends found", 404);

  currentTrends.forEach((trend, index) => {
    if (index >= 4) return;

    dataToSend.push({
      date: trend.date,
      id: trend.id,
    });
  });

  return res.status(201).json(dataToSend);
};

module.exports = getDatesOfTrends;
