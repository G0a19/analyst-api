const httpError = require("./../../functions/shared/httpError");
const Stock = require("./../../mongodb/stock");
const getKey = require("./../../keys/getKey");

const add = async function (req, res, next) {
  const { key } = req.body;
  if (!key) return httpError(res, "No key found", 404);
  if (key !== getKey("KEY")) return httpError(res, "Invalid key", 404);

  if (req.userData.user !== "admin")
    return httpError(res, "You are not allowed to add stock", 404);

  const { name, type } = req.body;
  if (!name) return httpError(res, "No stock found", 404);
  if (!type) return httpError(res, "No type found", 404);

  const stockToAdd = new Stock({
    name: name,
    type: type,
    dateAdded: new Date().toISOString(),
  });

  try {
    await stockToAdd.save();
  } catch (err) {
    return httpError(res, "Something went wrong please try again later", 404);
  }

  return res.status(201).json(stockToAdd);
};

module.exports = add;
