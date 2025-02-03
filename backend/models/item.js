const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  id: Number,
  name: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  price: Number,
  image: {
    type: String,
    // require: true,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
    