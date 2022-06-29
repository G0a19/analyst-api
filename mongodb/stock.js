const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  dateAdded: { type: String, required: true },
});

module.exports = mongoose.model("Stock", stockSchema);
