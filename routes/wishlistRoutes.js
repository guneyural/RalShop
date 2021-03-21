const Router = require("express").Router();
const {
  getWishlist,
  updateWishlist,
  removeAllWishlist,
} = require("../controllers/wishlist");
const { isUser } = require("../middlewares/isAuth");

Router.get("/", isUser, getWishlist);
Router.post("/update", isUser, updateWishlist);
Router.delete("/remove_all", isUser, removeAllWishlist);

module.exports = Router;
