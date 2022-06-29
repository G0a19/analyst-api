const express = require("express");
const mongoose = require("mongoose");
const middleware = require("./../middleware/middleware");

const add = require("./../functions/stocks/add");
const getStocks = require("./../functions/stocks/getStocks");

const router = express.Router();

router.get("/getstocks/:type", getStocks);

router.use(middleware);

router.post("/add", add);

module.exports = router;
