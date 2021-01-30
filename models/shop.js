const mongoose = require("mongoose");
const strOptions = { type: String, required: true };
const bcrypt = require("bcrypt");
const expressError = require("../utils/expressError");

const shopSchema = new mongoose.Schema(
  {
    name: strOptions,
    email: strOptions,
    password: strOptions,
    description: String,
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

shopSchema.pre("save", async function (next) {
  const shop = this;
  try {
    const hashed = await bcrypt.hash(shop.password, 10);
    this.password = hashed;
  } catch (err) {
    next(new expressError("An Error Occured While Creating Shop.", 500));
  }
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
