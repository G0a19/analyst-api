const httpError = require("./../shared/httpError");
const User = require("./../../mongodb/user");
const FriendsRequest = require("./../../mongodb/friendsRequest");

const getMyFriendRequests = async function (req, res, next) {
  const userId = req.userData.userId;

  let currentUser;
  try {
    currentUser = await User.findById(userId);
  } catch (err) {
    console.log(err);
    return httpError(res, "Something went wrong please try again later", 404);
  }

  if (!currentUser) return httpError(res, "No user found", 404);

  let friendRequests = [];
  for (
    let friendNumber = 0;
    friendNumber < currentUser.friends.friendsRequests.length;
    friendNumber++
  ) {
    let currentRequest;
    let userSent;
    try {
      currentRequest = await FriendsRequest.findById(
        currentUser.friends.friendsRequests[friendNumber]
      );
      if (!currentRequest) continue;
      userSent = await User.findById(currentRequest.sender);
    } catch (err) {
      console.log(err);
      return httpError(res, "Something went wrong please try again later", 404);
    }
    if (!userSent || !currentRequest) continue;

    friendRequests.push({
      name: userSent.fullName,
      requestId: currentRequest.id,
    });
  }

  return res.status(201).json(friendRequests);
};

module.exports = getMyFriendRequests;
