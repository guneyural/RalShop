const Router = require("express").Router();
const {
  getWishlist,
  updateWishlist,
  removeAllWishlist,
} = require("../controllers/wishlist");

Router.get("/", getWishlist);
Router.post("/update", updateWishlist);
Router.delete("/remove_all", removeAllWishlist);

module.exports = Router;
