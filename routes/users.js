const express = require("express");
const middleware = require("./../middleware/middleware");

const register = require("./../functions/users/register");
const signin = require("./../functions/users/signin");
const getUsers = require("./../functions/users/getUsers");
const deleteUser = require("./../functions/users/deleteUser");
const addFriends = require("./../functions/users/addFriends");
const getMyFriendRequests = require("./../functions/users/getMyFriendRequests");
const acceptOrReject = require("./../functions/users/acceptOrReject");
const deleteFriend = require("./../functions/users/deleteFriend");
const getMyFriends = require("./../functions/users/getMyFriends");

const router = express.Router();

router.get("/getusers/:key", getUsers);

router.post("/register", register);

router.post("/signin", signin);

router.use(middleware);

// router.delete("/deleteuser/", deleteUser);

router.post("/addfriends", addFriends);

router.post("/acceptorreject", acceptOrReject);

router.delete("/deletefriend/:friendId", deleteFriend);

router.get("/getMyFriends", getMyFriends);

router.get("/getmyfriendrequests", getMyFriendRequests);

module.exports = router;
