const mongoose = require("mongoose");
const strOptions = { type: String, required: true };
const numberOptions = { type: Number, required: true, min: 0 };

const productSchema = new mongoose.Schema(
  {
    title: strOptions,
    price: numberOptions,
    description: strOptions,
    stock: numberOptions,
    image: strOptions,
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
