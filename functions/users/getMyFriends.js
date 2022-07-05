const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const mongoose = require("mongoose");

const getMyFriends = async function (req, res, next) {
  const id = req.userData.userId;

  let currentUser;
  try {
    currentUser = await User.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!currentUser) return httpError(res, "No user found", 404);

  let friends = [];

  for (
    numberOfFriend = 0;
    numberOfFriend < currentUser.friends.friends.length;
    numberOfFriend++
  ) {
    let currentFriend;
    try {
      currentFriend = await User.findById(
        currentUser.friends.friends[numberOfFriend]
      );
    } catch (err) {
      console.log(err);
      return httpError(res, "Something went wrong please try again later", 404);
    }

    if (!currentFriend) continue;

    friends.push({
      id: currentFriend.id,
      fullName: currentFriend.fullName,
    });
  }

  res.status(201).json(friends);
};

module.exports = getMyFriends;
