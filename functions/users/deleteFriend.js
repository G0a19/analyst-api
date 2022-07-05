const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const mongoose = require("mongoose");

const deleteFriend = async function (req, res, next) {
  const userId = req.userData.userId;

  const { friendId } = req.params;

  if (userId == friendId)
    return httpError(res, "Something went wrong please try again later", 404);

  let currentUser, friendUser;

  try {
    currentUser = await User.findById(userId);
    friendUser = await User.findById(friendId);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentUser || !friendUser) return httpError(res, "No user found", 404);

  const haveThisFriend = currentUser.friends.friends.some(
    (friend) => friend == friendId
  );
  const myFriendHaveMe = friendUser.friends.friends.some(
    (friend) => friend == userId
  );

  if (!haveThisFriend || !myFriendHaveMe)
    return httpError(res, "No friend found", 404);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    currentUser.friends.friends.pull(friendId);
    friendUser.friends.friends.pull(userId);
    await currentUser.save();
    await friendUser.save();
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return httpError(res, "The delete failed please try again later", 404);
  }

  return res.status(201).json({ massage: "Friend deleted" });
};

module.exports = deleteFriend;
