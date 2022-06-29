const jwt = require("jsonwebtoken");

const httpError = require("./../functions/shared/httpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return httpError(res, "Authentication failed!", 403);
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId, user: decodedToken.user };
    next();
  } catch (err) {
    return httpError(res, "Authentication failed!", 403);
  }
};
