const Router = require("express").Router();
const {
  createShop,
  loginShop,
  getShopById,
  getCurrentShop,
} = require("../controllers/shop");
const { isShop } = require("../middlewares/isAuth");

Router.post("/create", createShop);
Router.post("/login", loginShop);
Router.get("/p/:id", getShopById);
Router.get("/current", isShop, getCurrentShop);

module.exports = Router;
