const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exsitStockSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  dateAdded: { type: String, required: true },
});

module.exports = mongoose.model("existStock", exsitStockSchema);
