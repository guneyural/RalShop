const Router = require("express").Router();
const {
  getProductReviews,
  getReviewById,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/review");
const { isUser } = require("../middlewares/isAuth");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: "Rate Limit Exceeded.",
});

Router.get("/product/:id", getProductReviews);
Router.get("/:id", getReviewById);
Router.post("/product/:id/review", isUser, limiter, createReview);
Router.delete("/:id", isUser, deleteReview);
Router.put("/:id", isUser, limiter, updateReview);

module.exports = Router;
