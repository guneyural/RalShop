const Router = require("express").Router();
const {
  createShop,
  loginShop,
  getShopById,
  getCurrentShop,
} = require("../controllers/shop");
const { isShop } = require("../middlewares/isAuth");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Rate Limit Exceeded.",
});

Router.post("/create", limiter, createShop);
Router.post("/login", limiter, loginShop);
Router.get("/p/:id", getShopById);
Router.get("/current", isShop, getCurrentShop);

module.exports = Router;
