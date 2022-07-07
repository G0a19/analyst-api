const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const FriendsRequest = require("./../../mongodb/friendsRequest");
const mongoose = require("mongoose");

const addFriends = async function (req, res, next) {
  const { friendId } = req.body;
  if (!friendId) return httpError(res, "No friend id found", 404);

  if (friendId === req.userData.userId)
    return httpError(res, "Can not send a friend request to your self", 404);

  let userFriend;
  let currntUser;
  try {
    userFriend = await User.findById(friendId);
    currntUser = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!userFriend || !currntUser)
    return httpError(res, "No friend id found", 404);

  const ifFriendUserIsExsits = currntUser.friends.friends.some(
    (friend) => friend == friendId
  );

  if (ifFriendUserIsExsits)
    return httpError(res, "Can not send a friend request to this user", 404);

  let friendRequest;
  try {
    friendRequest = await FriendsRequest.find({
      sender: req.userData.userId,
    });
  } catch (err) {
    return httpError(res, "Can not send a friend request to this user", 404);
  }

  const isFriendReqExcist = friendRequest.some(
    (friend) => friend.reciver == friendId
  );

  if (isFriendReqExcist)
    return httpError(res, "Can not send a friend request to this user", 404);

  const newRequest = new FriendsRequest({
    sender: req.userData.userId,
    reciver: friendId,
    date: new Date().toISOString(),
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    currntUser.friends.sendRequests.push(newRequest);
    userFriend.friends.friendsRequests.push(newRequest);
    await currntUser.save();
    await userFriend.save();
    await newRequest.save();
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  return res.status(201).json({ massage: "Request sended" });
};

module.exports = addFriends;
