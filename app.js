const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("./keys/syncKey");

const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

const limiter = require("./routes/limiter");
const users = require("./routes/users");
const stocks = require("./routes/stocks");
const trendOfTheWeek = require("./routes/trendOfTheWeek");

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("upload", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(limiter);
app.use("/users", users);
app.use("/stocks", stocks);
app.use("/trendoftheweek", trendOfTheWeek);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port);
    console.log("in");
  })
  .catch((err) => {
    console.log(err);
  });
