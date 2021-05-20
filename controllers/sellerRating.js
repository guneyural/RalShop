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
    const newRatingObject = new SellerRating({
      rating,
      user,
      seller,
      sellerObject: seller,
    });
    savedRating = await newRatingObject.save();
  }

  let populatedRating = await savedRating.execPopulate("sellerObject");
  res.status(200).json(populatedRating);
});
const getUserRatings = catchAsync(async (req, res) => {
  const user = req.user;

  const getRatings = await SellerRating.find({ user: user.id }).populate(
    "sellerObject"
  );
  res.json(getRatings);
});
const getSellerRatings = catchAsync(async (req, res) => {
  const shop = req.shop;

  const getRatings = await SellerRating.find({ seller: shop.id });
  res.json(getRatings);
});
const deleteRating = catchAsync(async (req, res) => {
  const ratingId = req.params.id;

  SellerRating.findByIdAndRemove(ratingId).then(() => {
    res.status(200).json("success");
  });
});

const calculateSellerRating = catchAsync(async (req, res) => {
  const { seller } = req.body;
  let sum = 0;
  const getRatings = await SellerRating.find({ sellerObject: seller });

  const getSeller = await Seller.findById(seller);
  getRatings.forEach((ratingItem) => {
    sum += ratingItem.rating;
  });

  getSeller.rating = parseFloat(sum / getRatings.length).toFixed(1);
  getSeller.ratingCount = getRatings.length;
  await getSeller.save();
  res.json("seller rating calculated");
});

module.exports = {
  rateSeller,
  getUserRatings,
  getSellerRatings,
  deleteRating,
  calculateSellerRating,
};
