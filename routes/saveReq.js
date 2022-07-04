const appendSheets = require("./../functions/google sheets/appendSheets");

module.exports = async (req, res, next) => {
  try {
    appendSheets(
      "H",
      "K",
      req.connection.remoteAddress
        .replace("::ffff:", "")
        .replace(":", "")
        .replace(":", ""),
      req.method,
      req.originalUrl,
      new Date().toISOString()
    );
  } catch (err) {
    console.log(err);
  }

  next();
};
