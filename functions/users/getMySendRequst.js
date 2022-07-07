const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const FriendsRequest = require("./../../mongodb/friendsRequest");
const mongoose = require("mongoose");

const getMySendRequst = async function (req, res, next) {
  const id = req.userData.userId;

  let currentUser;
  try {
    currentUser = await User.findById(id);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentUser) return httpError(res, "No user found", 404);
  let friendSendRequests = [];

  for (
    let NumberOfRequest = 0;
    NumberOfRequest < currentUser.friends.sendRequests.length;
    NumberOfRequest++
  ) {
    try {
      currentRequest = await FriendsRequest.findById(
        currentUser.friends.sendRequests[NumberOfRequest]
      );
      if (!currentRequest) return;
      userReciver = await User.findById(currentRequest.reciver);
    } catch (err) {
      console.log(err);
      return httpError(res, "Something went wrong please try again later", 404);
    }

    if (!userReciver || !currentRequest) continue;

    friendSendRequests.push({
      name: userReciver.fullName,
      requestId: currentRequest.id,
    });
  }

  return res.status(201).json(friendSendRequests);
};

module.exports = getMySendRequst;
