const Router = require("express").Router();
const userController = require("../controllers/user");
const { isUser } = require("../middlewares/isAuth");

Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.get("/p/:username", userController.getUserByUsername);
Router.get("/current", isUser, userController.getCurrentUser);

module.exports = Router;
