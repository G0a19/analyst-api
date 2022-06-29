var cron = require("node-cron");
const createNewKey = require("./createNewKey");

cron.schedule("*/10 * * * *", async function () {
  createNewKey("KEY");
});

module.exports;
