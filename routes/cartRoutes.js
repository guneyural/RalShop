const Router = require("express").Router();
const {
  createCard,
  addToCard,
  deleteCard,
  getCard,
} = require("../controllers/cart");
const { isUser } = require("../middlewares/isAuth");

Router.post("/", isUser, createCard);
Router.put("/", isUser, addToCard);
Router.delete("/", isUser, deleteCard);
Router.get("/", isUser, getCard);

module.exports = Router;
