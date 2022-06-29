const mongoose = require("mongoose");
const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const getKey = require("./../../keys/getKey");

const getUsers = async function (req, res, next) {
  const { key } = req.params;
  if (key === getKey("KEY")) {
    try {
      const users = await User.find({}, "-password");
      return res
        .status(201)
        .json({ users: users.map((user) => user.toObject({ getters: true })) });
    } catch (err) {
      return httpError(res, "Something went wrong please try again later", 404);
    }
  }
  return httpError(res, "You are not allowed to enter", 404);
};

module.exports = getUsers;
