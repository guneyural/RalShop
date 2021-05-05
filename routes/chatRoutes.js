const Router = require("express").Router();
const { isLoggedIn } = require("../middlewares/isAuth");
const {
  createRoom,
  getChatrooms,
  getMessages,
  sendImage,
  getChatNotifications,
} = require("../controllers/chat");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

Router.get("/getChatrooms", isLoggedIn, getChatrooms);
Router.get("/getMessages/:chatroom", isLoggedIn, getMessages);
Router.get("/notifications", isLoggedIn, getChatNotifications);
Router.post("/createRoom", isLoggedIn, createRoom);
Router.post("/sendImage", isLoggedIn, upload.single("image"), sendImage);

module.exports = Router;
