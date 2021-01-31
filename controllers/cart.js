const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Cart = require("../models/shoppingCart");
const mongoId = require("mongoose").Types.ObjectId;

const createCard = catchAsync(async (req, res) => {
  const newCart = new Cart();
  newCart.user = req.user.id;
  const cart = await newCart.save();
  res.status(201).json(cart);
});

const addToCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart)
    return next(new expressError("You Don't Have A Shopping Cart.", 404));

  const updateCart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updateCart);
});

const deleteCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found.", 404));
  if (getCart.user == req.user.id) {
    await Cart.findOneAndDelete({ user: req.user.id });
    return res.json("Cart Deleted.");
  }
  return next(new expressError("You Are Not Owner Of This Card.", 403));
});

const getCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found.", 404));
  if (getCart.user == req.user.id) return res.json(getCart);
  return next(new expressError("You Are Not Owner Of This Card.", 403));
});

module.exports = {
  createCard,
  addToCard,
  deleteCard,
  getCard,
};
