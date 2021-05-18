const Router = require("express").Router();
const {
  rateSeller,
  getUserRatings,
  getSellerRatings,
  deleteRating,
  calculateSellerRating,
} = require("../controllers/sellerRating");
const { isUser, isShop } = require("../middlewares/isAuth");

Router.get("/user_ratings", isUser, getUserRatings);
Router.get("/seller_ratings", isShop, getSellerRatings);
Router.post("/calculate_seller_rating", calculateSellerRating);
Router.post("/", isUser, rateSeller);
Router.delete("/:id", isUser, deleteRating);

module.exports = Router;
