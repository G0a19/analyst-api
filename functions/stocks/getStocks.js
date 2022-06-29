const httpError = require("./../../functions/shared/httpError");
const Stock = require("./../../mongodb/stock");

const getStocks = async function (req, res, next) {
  const { type } = req.params;
  if (!type) return httpError(res, "No type found", 404);

  let stocks;
  try {
    stocks = await Stock.find({ type: type });
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!stocks || stocks.length === 0)
    return httpError(res, "No stocks found", 404);

  return res
    .status(201)
    .json({ stocks: stocks.map((stock) => stock.toObject({ getters: true })) });
};

module.exports = getStocks;
