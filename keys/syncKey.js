var cron = require("node-cron");
const createNewKey = require("./createNewKey");

cron.schedule("0 1 * * *", async function () {
  createNewKey("KEY");
});

//

module.exports;
