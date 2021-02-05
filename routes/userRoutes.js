const Router = require("express").Router();
const userController = require("../controllers/user");
const { isUser } = require("../middlewares/isAuth");

Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.get("/p/:username", userController.getUserByUsername);
Router.get("/current", isUser, userController.getCurrentUser);
Router.get("/resetPassword", isUser, userController.resetPassword);
Router.delete("/remove", isUser, userController.removeUser);
Router.put("/", isUser, userController.updateUserData);

module.exports = Router;
