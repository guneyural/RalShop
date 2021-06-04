const Router = require("express").Router();
const {
  createShop,
  editShop,
  loginShop,
  getShopById,
  getCurrentShop,
  sendForgetPasswordEmail,
  checkResetPasswordToken,
  changePassword,
  getSellerCharts,
} = require("../controllers/shop");
const { isShop } = require("../middlewares/isAuth");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: "Rate Limit Exceeded.",
});

Router.post("/create", limiter, createShop);
Router.post("/login", limiter, loginShop);
Router.post("/sendEmail", limiter, sendForgetPasswordEmail);
Router.post("/checkToken", limiter, checkResetPasswordToken);
Router.post("/changePassword", limiter, changePassword);
Router.put("/update/:id", isShop, limiter, editShop);
Router.get("/p/:id", getShopById);
Router.get("/current", isShop, getCurrentShop);
Router.get("/charts", isShop, getSellerCharts);

module.exports = Router;
