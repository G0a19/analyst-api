const httpError = require("./../shared/httpError");
const { validateEmailAddress } = require("./../shared/validator");
const bcrypt = require("bcryptjs");
const User = require("./../../mongodb/user");
const appendSheets = require("./../google sheets/appendSheets");

const register = async function (req, res, next) {
  const { email, password, fullname } = req.body;

  if (!email) return httpError(res, "Email is requied", 404);
  if (!validateEmailAddress(email))
    return httpError(res, "Invalid email address", 404);
  if (!password) return httpError(res, "Password is requied", 404);
  if (password.length < 5)
    return httpError(
      res,
      "The password must be at least 5 characters long",
      404
    );
  if (!fullname) return httpError(res, "Full name is requied", 404);
  if (fullname.length < 2) return httpError(res, "Invalid Full name", 404);

  try {
    const existsUser = await User.findOne({ email: email });
    if (existsUser) return httpError(res, "The email is already in use", 404);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  try {
    const newUser = await new User({
      password: hashPassword,
      email,
      fullName: fullname,
      user: "user",
    });
    await appendSheets("G", "I", newUser.id, new Date().toISOString(), req.ip);
    await newUser.save();
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  return res.status(201).json({
    user: {
      email,
      fullname,
    },
  });
};

module.exports = register;
