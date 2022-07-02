const express = require("express");
const mongoose = require("mongoose");
const middleware = require("./../middleware/middleware");

const crypto = require("../functions/syncStocks/crypto");

const router = express.Router();

router.get("/crypto/:key", crypto);

module.exports = router;
