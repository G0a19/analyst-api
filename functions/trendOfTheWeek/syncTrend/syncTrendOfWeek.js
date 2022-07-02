var cron = require("node-cron");
const httpError = require("./../../shared/httpError");
const TrendOfTheWeek = require("./../../../mongodb/trendOfTheWeek");
const Stocks = require("./../../../mongodb/stock");

const syncTrendOfWeek = async function () {
  const today = new Date();

  let currentTrendOfTheWeeks = await TrendOfTheWeek.find();
  currentTrendOfTheWeeks.forEach(async (trend, index) => {
    const date = new Date(trend.date);
    const nextWeekOfTheDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 7
    );
    if (
      nextWeekOfTheDate.getTime() < today.getTime() &&
      today.getDay() === 6 &&
      date.getUTCDate() !== today.getUTCDate() &&
      !trend.type.includes("no active")
    ) {
      const newTrend = new TrendOfTheWeek({
        type: trend.type,
        date: today.toISOString(),
        allUsers: [],
        stocks: [],
      });
      trend.type = trend.type + " no active";
      try {
        await trend.save();
      } catch (err) {
        console.log(err);
      }
      for (
        let numberOfStock = 0;
        numberOfStock < trend.stocks.length;
        numberOfStock++
      ) {
        let currentStock;
        try {
          currentStock = await Stocks.findById(
            trend.stocks[numberOfStock].stockId
          );
        } catch (err) {
          console.log(err);
        }
        if (!currentStock) {
          return;
        }
        currentStock.type = currentStock.type + " no active";
        try {
          await currentStock.save();
          await newTrend.save();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
};

syncTrendOfWeek();

cron.schedule("*/30 * * * *", async function () {
  syncTrendOfWeek();
});

module.exports;
