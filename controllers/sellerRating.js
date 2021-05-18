const SellerRating = require("../models/sellerRating");
const Seller = require("../models/shop");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");

const rateSeller = catchAsync(async (req, res, next) => {
  const { rating, user, seller } = req.body;
  let savedRating = "";

  if (typeof rating !== "number") {
    return next(new expressError("Enter valid rating", 400));
  }
  if (rating < 1 || rating > 5) {
    return next(new expressError("Rating must be between 1 and 5", 400));
  }

  const findExistingRating = await SellerRating.findOne({
    $and: [{ user }, { seller }],
  });

  if (findExistingRating) {
    findExistingRating.rating = rating;
    savedRating = await findExistingRating.save();
  } else {
    const newRatingObject = new SellerRating({ rating, user, seller });
    savedRating = await newRatingObject.save();
  }

  calculateSellerRating(seller);
  res.status(200).json(savedRating);
});
const getUserRatings = catchAsync(async (req, res) => {
  const user = req.user;

  const getRatings = await SellerRating.find({ user: user.id });
  res.json(getRatings);
});
const getSellerRatings = catchAsync(async (req, res) => {
  const shop = req.shop;

  const getRatings = await SellerRating.find({ seller: shop.id });
  res.json(getRatings);
});
const deleteRating = catchAsync(async (req, res) => {
  const ratingId = req.params.id;
  const seller = req.body.seller;

  await SellerRating.findByIdAndRemove(ratingId);
  calculateSellerRating(seller);

  res.status(200).json("success");
});

async function calculateSellerRating(seller) {
  let sum = 0;
  const getRatings = await SellerRating.find({ seller });
  const getSeller = await Seller.findById(seller);
  getRatings.forEach((ratingItem) => {
    sum += ratingItem.rating;
  });
  getSeller.rating = (sum / getRatings.length).toFixed(1);
  await getSeller.save();
}

module.exports = { rateSeller, getUserRatings, getSellerRatings, deleteRating };
