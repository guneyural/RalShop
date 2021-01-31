const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [{ type: Object }],
    cartTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
