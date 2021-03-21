const Wishlist = require("../models/wishlist");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");

const getWishlist = catchAsync(async (req, res, next) => {
  const getWishlist = await Wishlist.findOne({ owner: req.user.id }).populate(
    "products"
  );
  if (!getWishlist) return next(new expressError("Wishlist Not Found", 404));
  res.json(getWishlist);
});

const updateWishlist = catchAsync(async (req, res, next) => {
  const getWishlist = await Wishlist.findOne({ owner: req.user.id });
  if (!getWishlist) return next(new expressError("Wishlist Not Found", 404));
  const { products } = req.body;
  getWishlist.products = [];
  products.forEach((item) => {
    getWishlist.products.push(item._id);
  });
  const savedWishlist = await getWishlist.save();
  const returnedWishlist = await Wishlist.findById(savedWishlist._id).populate(
    "products"
  );
  res.json(returnedWishlist);
});

const removeAllWishlist = catchAsync(async (req, res, next) => {
  const getWishlist = await Wishlist.findOne({ owner: req.user.id });
  if (!getWishlist) return next(new expressError("Wishlist Not Found", 404));
  getWishlist.products = [];
  const saveWishlist = await getWishlist.save();
  res.json(saveWishlist);
});

module.exports = {
  getWishlist,
  updateWishlist,
  removeAllWishlist,
};
