const Router = require("express").Router();
const {
  createCard,
  addToCard,
  deleteCard,
  getCard,
} = require("../controllers/cart");
const { isUser } = require("../middlewares/isAuth");

Router.post("/create", isUser, createCard);
Router.put("/add", isUser, addToCard);
Router.delete("/remove/:id", isUser, deleteCard);
Router.get("/get/:id", isUser, getCard);

module.exports = Router;
