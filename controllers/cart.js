const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Cart = require("../models/shoppingCart");

const getCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found.", 404));
  if (getCart.user == req.user.id) return res.json(getCart);
  return next(new expressError("You Are Not Owner Of This Card.", 403));
});

const updateCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found", 404));
  const { products } = req.body;
  getCart.items = [];
  let sum = 0;
  products.forEach((item) => {
    sum += item.price;
    getCart.items.push({
      product: item._id,
      color: item.color,
      quantity: item.qty,
    });
  });
  getCart.cartTotal = sum;
  const savedCart = await getCart.save();
  const returnedCart = await Cart.findById(savedCart._id).populate("items");
  res.json(returnedCart);
});

const removeAllCard = catchAsync(async (req, res, next) => {
  const getCart = await Cart.findOne({ user: req.user.id });
  if (!getCart) return next(new expressError("Cart Not Found", 404));
  getCart.items = [];
  const saveCart = await getCart.save();
  res.json(saveCart);
});

module.exports = {
  getCard,
  updateCard,
  removeAllCard,
};
