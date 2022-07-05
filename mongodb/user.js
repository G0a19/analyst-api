const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  user: { type: String, required: true },
  votes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Vote" }],
  friends: {
    friends: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
    friendsRequests: [
      { type: mongoose.Types.ObjectId, required: true, ref: "FriendsRequest" },
    ],
    sendRequests: [
      { type: mongoose.Types.ObjectId, required: true, ref: "FriendsRequest" },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
