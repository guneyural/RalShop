const Router = require("express").Router();
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address");
const { isUser } = require("../middlewares/isAuth");

Router.post("/", isUser, createAddress);
Router.get("/", isUser, getAddresses);
Router.put("/:id", isUser, updateAddress);
Router.delete("/:id", isUser, deleteAddress);

module.exports = Router;
