const httpError = require("./../shared/httpError");
const { validateEmailAddress } = require("./../shared/validator");
const bcrypt = require("bcryptjs");
const User = require("./../../mongodb/user");
const jwt = require("jsonwebtoken");

const signIn = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email) return httpError(res, "Email field is requierd", 404);
  if (!password) return httpError(res, "password field is requierd", 404);

  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user)
      return httpError(res, "No user found for this email address", 404);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  try {
    const hashPasswordCompere = await bcrypt.compare(password, user.password);
    if (!hashPasswordCompere)
      return httpError(res, "Wrong password for this email address", 404);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  let token;
  try {
    token = await jwt.sign(
      { userId: user.id, email: user.email, user: user.user },
      "supersecret_dont_share",
      { expiresIn: "7d" }
    );
  } catch (err) {
    return httpError(res, "Logging in failed, please try again later.", 404);
  }

  res.status(201).json({ token: token });
};

module.exports = signIn;
