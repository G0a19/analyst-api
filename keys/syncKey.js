var cron = require("node-cron");
const createNewKey = require("./createNewKey");

createNewKey("KEY");

cron.schedule("*/30 * * * *", async function () {
  createNewKey("KEY");
});

module.exports;
