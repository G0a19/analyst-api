const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const FriendsRequest = require("./../../mongodb/friendsRequest");
const mongoose = require("mongoose");

const deleteMySendReq = async function (req, res, next) {
  const userId = req.userData.userId;
  const { requestid } = req.params;

  if (!requestid) return httpError(res, "No request id found", 404);

  let currentUser, currentRequest;
  try {
    currentUser = await User.findById(userId);
    currentRequest = await FriendsRequest.findById(requestid);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentUser) return httpError(res, "No user found", 404);
  if (!currentRequest) return httpError(res, "No request found", 404);

  let reciverUser;
  try {
    reciverUser = await User.findById(currentRequest.reciver);
  } catch (err) {
    console.log(err);
  }

  if (!reciverUser) return httpError(res, "No user found", 404);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    currentUser.friends.sendRequests.pull(currentRequest);
    reciverUser.friends.friendsRequests.pull(currentRequest);
    await currentRequest.delete();
    await currentUser.save();
    await reciverUser.save();
    await sess.commitTransaction();
    return res.status(201).json({ massage: "Request deleted" });
  } catch (err) {
    console.log(err);
    return httpError(res, "The delete failed please try again later", 404);
  }
};

module.exports = deleteMySendReq;
