const mongoose = require("mongoose");
const strOptions = { type: String, required: true };

const shopSchema = new mongoose.Schema(
  {
    name: strOptions,
    description: String,
    image: String,
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
