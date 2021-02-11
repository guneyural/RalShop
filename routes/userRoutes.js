const Router = require("express").Router();
const userController = require("../controllers/user");
const { isUser } = require("../middlewares/isAuth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
});
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 6,
  message: "Rate Limit Exceeded.",
});

Router.get("/p/:username", userController.getUserByUsername);
Router.get("/current", isUser, userController.getCurrentUser);
Router.post(
  "/checkPasswordResetCode",
  passwordLimiter,
  userController.checkResetPasswordToken
);
Router.post("/register", limiter, userController.register);
Router.post("/login", userController.login);
Router.post(
  "/sendEmail",
  passwordLimiter,
  userController.sendForgetPasswordEmail
);
Router.post("/newPassword", passwordLimiter, userController.changePassword);
Router.post("/remove", limiter, isUser, userController.removeUser);
Router.put(
  "/resetPassword",
  passwordLimiter,
  isUser,
  userController.resetPassword
);
Router.put(
  "/update",
  upload.single("profilePhoto"),
  isUser,
  userController.updateUserData
);

module.exports = Router;
