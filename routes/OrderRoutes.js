const Router = require("express").Router();
const { isShop, isUser } = require("../middlewares/isAuth");
const {
  createOrder,
  getOrdersBySeller,
  getOrdersByUser,
  changeOrderStatus,
  orderCancelRequest,
  refundOrder,
} = require("../controllers/order");

Router.get("/user-orders", isUser, getOrdersByUser);
Router.get("/seller-orders", isShop, getOrdersBySeller);
Router.post("/", isUser, createOrder);
Router.post("/change-status", isShop, changeOrderStatus);
Router.post("/cancel-request", isUser, orderCancelRequest);
Router.post("/refund", isShop, refundOrder);

module.exports = Router;
