const appendSheets = require("./../functions/google sheets/appendSheets");

module.exports = async (req, res, next) => {
  try {
    appendSheets(
      "H",
      "J",
      req.connection.remoteAddress,
      req.method,
      new Date().toISOString()
    );
  } catch (err) {
    console.log(err);
  }

  next();
};
