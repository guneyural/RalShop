const Router = require("express").Router();
const userController = require("../controllers/user");
const { isUser } = require("../middlewares/isAuth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.get("/p/:username", userController.getUserByUsername);
Router.get("/current", isUser, userController.getCurrentUser);
Router.put("/resetPassword", isUser, userController.resetPassword);
Router.delete("/remove", isUser, userController.removeUser);
Router.put(
  "/update",
  upload.single("profilePhoto"),
  isUser,
  userController.updateUserData
);

module.exports = Router;
