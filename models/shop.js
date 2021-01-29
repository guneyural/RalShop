const mongoose = require("mongoose");
const strOptions = { type: String, required: true };
const bcrypt = require("bcrypt");

const shopSchema = new mongoose.Schema(
  {
    name: strOptions,
    email: strOptions,
    description: String,
    image: String,
  },
  { timestamps: true }
);

shopSchema.pre("save", async function (next) {});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
