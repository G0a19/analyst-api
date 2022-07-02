var cron = require("node-cron");
const httpError = require("./../../shared/httpError");
const TrendOfTheWeek = require("./../../../mongodb/trendOfTheWeek");
const Stocks = require("./../../../mongodb/stock");

const syncTrendOfWeek = async function () {
  const today = new Date();

  let currentTrendOfTheWeeks = await TrendOfTheWeek.find();
  currentTrendOfTheWeeks.forEach(async (trend, index) => {
    const date = new Date(trend.date);
    if (today.getDay() === 6 && date.getUTCDate() !== today.getUTCDate()) {
      trend.type = trend.type + " no active";
      try {
        await trend.save();
      } catch (err) {
        console.log(err);
      }
      trend.stocks.forEach(async (stock) => {
        let currentStock;
        try {
          currentStock = await Stocks.findById(stock.stockId);
        } catch (err) {
          console.log(err);
        }
        if (!currentStock) {
          return;
        }
        currentStock.type = currentStock.type + " no active";
        try {
          await currentStock.save();
        } catch (err) {
          console.log(err);
        }
      });
    }
  });
};

syncTrendOfWeek();

cron.schedule("*/30 * * * *", async function () {
  syncTrendOfWeek();
});

module.exports;
