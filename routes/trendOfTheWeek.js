const express = require("express");
const mongoose = require("mongoose");
const httpError = require("./../functions/shared/httpError");
const middleware = require("./../middleware/middleware");
const TrendOfTheWeek = require("./../mongodb/trendOfTheWeek");
const Stocks = require("./../mongodb/stock");
const User = require("./../mongodb/user");
const Vote = require("./../mongodb/vote");

const vote = require("./../functions/trendOfTheWeek/vote");
const myVotes = require("./../functions/trendOfTheWeek/myVotes");
const deleteMyVote = require("../functions/trendOfTheWeek/deleteMyVote");
const getTrend = require("../functions/trendOfTheWeek/getTrend");

const router = express.Router();

router.get("/myvotes/:userid", myVotes);

router.get("/gettrend/:tredtype", getTrend);

router.use(middleware);

router.post("/vote", vote);

router.delete("/deletevote/:voteid", deleteMyVote);

module.exports = router;
