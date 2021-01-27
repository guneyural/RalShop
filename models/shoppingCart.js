const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cartTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", userSchema);

module.exports = Cart;
