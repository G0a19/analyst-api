const httpError = function (res, massage, errorNumber) {
  return res.status(errorNumber).json({ error: massage });
};

module.exports = httpError;
