const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const mongoId = require("mongoose").Types.ObjectId;
const Review = require("../models/review");
const Product = require("../models/product");

const getReviewById = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));
  const getReview = await Review.findById(req.params.id);
  if (!getReview) return next(new expressError("Review Could Not Found.", 404));
  res.json(getReview);
});

const createReview = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));
  const getProduct = await Product.findById(req.params.id);
  if (!getProduct) return next(new expressError("Product Not Found", 404));
  const { rating, text } = req.body;
  if (rating < 1 || rating > 5)
    return next(new expressError("Rating Must Be Between 1 And 5.", 400));
  if (text.length < 10)
    return next(new expressError("Text Must Be At Least 10 Characters.", 400));

  const newReview = await new Review({
    rating,
    text,
    productId: req.params.id,
    user: req.user.id,
  });
  const saveReview = (await newReview.save()).populate("user");
  res.json(saveReview);
});

const deleteReview = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));
  const getReview = await Review.findById(req.params.id);
  if (!getReview) return next(new expressError("Review Does Not Exist.", 404));
  if (getReview.user !== req.user.id)
    return next(new expressError("You are not owner of this review.", 403));
  await Review.findByIdAndDelete(req.params.id);
  res.json("Review Successfully Deleted");
});

const updateReview = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));
  const getReview = await Review.findById(req.params.id);
  if (!getReview) return next(new expressError("Review Does Not Exist.", 404));
  if (getReview.user !== req.user.id)
    return next(new expressError("You are not owner of this review.", 403));
  const { rating, text } = req.body;
  if (rating < 1 || rating > 5)
    return next(new expressError("Rating Must Be Between 1 And 5.", 400));
  if (text.length < 10)
    return next(new expressError("Text Must Be At Least 10 Characters.", 400));
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    {
      rating,
      text,
    },
    { new: true }
  );
  res.json(updatedReview);
});

const getProductReviews = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));
  const getProduct = await Product.findById(req.params.id);
  if (!getProduct) return next(new expressError("Product Not Found", 404));
  const getReviews = await Review.find({ productId: getProduct._id })
    .sort({ createdAt: "desc" })
    .populate("user");
  res.json(getReviews);
});

module.exports = {
  getReviewById,
  createReview,
  deleteReview,
  updateReview,
  getProductReviews,
};
