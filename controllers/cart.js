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

const addToCard = catchAsync(async (req, res, next) => {});

const deleteCard = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id", 400));
  const getCart = await Cart.findById(req.params.id);
  if (!getCart) return next(new expressError("Cart Not Found.", 404));
  if (getCart.user == req.user.id) {
    await Cart.findByIdAndDelete(req.params.id);
    return res.json("Cart Deleted.");
  }
  return next(new expressError("You Are Not Owner Of This Card.", 403));
});

const getCard = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id", 400));
  const getCart = await Cart.findById(req.params.id);
  if (!getCart) return next(new expressError("Cart Not Found.", 404));

  if (getCart.user == req.user.id) {
    return res.json(getCart);
  }
  return next(new expressError("You Are Not Owner Of This Card.", 403));
});

module.exports = {
  createCard,
  addToCard,
  deleteCard,
  getCard,
};
