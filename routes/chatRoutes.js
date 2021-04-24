const Router = require("express").Router();
const { isLoggedIn } = require("../middlewares/isAuth");
const {
  createRoom,
  getChatrooms,
  getMessages,
} = require("../controllers/chat");

Router.get("/getChatrooms", isLoggedIn, getChatrooms);
Router.get("/getMessages/:chatroom", isLoggedIn, getMessages);
Router.post("/createRoom", isLoggedIn, createRoom);

module.exports = Router;
