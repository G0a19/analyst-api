const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const FriendsRequest = require("./../../mongodb/friendsRequest");
const mongoose = require("mongoose");

const acceptOrReject = async function (req, res, next) {
  const id = req.userData.userId;
  const { answer, requestId } = req.body;

  if (!answer || (answer != "false" && answer != "true"))
    return httpError(res, "No answer found", 404);
  if (!requestId) return httpError(res, "No request found", 404);

  let currentUser;
  let currentRequest;
  let senderUser;
  try {
    currentUser = await User.findById(id);
    currentRequest = await FriendsRequest.findById(requestId);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentUser) return httpError(res, "No user found", 404);
  if (!currentRequest) return httpError(res, "No request found", 404);

  if (id != currentRequest.reciver)
    return httpError(res, "You not allowed to accept this friend request", 404);

  try {
    senderUser = await User.findById(currentRequest.sender);
  } catch (err) {
    console.log(err);
  }

  if (!senderUser) return httpError(res, "No user found", 404);

  if (answer === "false") {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      currentUser.friends.friendsRequests.pull(currentRequest);
      senderUser.friends.sendRequests.pull(currentRequest);
      await currentRequest.delete();
      await currentUser.save();
      await senderUser.save();
      await sess.commitTransaction();
      return res.status(201).json({ massage: "Request deleted" });
    } catch (err) {
      console.log(err);
      return httpError(res, "The delete failed please try again later", 404);
    }
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    currentUser.friends.friends.push(senderUser);
    currentUser.friends.friendsRequests.pull(currentRequest);
    senderUser.friends.friends.push(currentUser);
    senderUser.friends.sendRequests.pull(currentRequest);
    await currentRequest.delete();
    await currentUser.save();
    await senderUser.save();
    await sess.commitTransaction();
    return res.status(201).json({ massage: "New friend added" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = acceptOrReject;
