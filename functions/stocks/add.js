const httpError = require("./../../functions/shared/httpError");
const Stock = require("./../../mongodb/stock");

const add = async function (name, type, res) {
  if (!name) return httpError(res, "No stock found", 404);
  if (!type) return httpError(res, "No type found", 404);

  const stockToAdd = new Stock({
    name: name,
    type: type,
    dateAdded: new Date().toISOString(),
  });

  return stockToAdd;
};

module.exports = add;
