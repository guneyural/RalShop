const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const { UserValidation } = require("../validations/shcmeas");
const bcrypt = require("bcrypt");

const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = UserValidation.validate(req.body);
  if (!req.body.username || !email || !password) {
    return next(new expressError("Fill All Fields", 400));
  }
  if (error)
    return next(
      new expressError(
        error.details[0].message.split(" ")[
          error.details[0].message.split(" ").length - 1
        ] === "email"
          ? "Email Must Be A Valid Email"
          : "Username Must Be Less Than 30 Characters",
        400
      )
    );

  const findUserByEmail = await User.findOne({ email: req.body.email });
  const findUserByUsername = await User.findOne({
    username: req.body.username,
  });
  if (findUserByEmail) return next(new expressError("Email Exists.", 400));
  if (findUserByUsername)
    return next(new expressError("Username Exists.", 400));

  const createUser = new User(req.body);
  const saveUser = await createUser.save();

  const token = jwt.sign({ id: saveUser._id }, process.env.SECRET, {
    expiresIn: "5d",
  });

  res.status(201).json(token);
});

const login = catchAsync(async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password)
    return next(new expressError("Fill All Fields.", 400));

  const findUser = await User.findOne({
    $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
  });
  if (!findUser) return next(new expressError("User Does Not Exist.", 404));

  const comparePassword = await bcrypt.compare(password, findUser.password);
  if (!comparePassword)
    return next(new expressError("Invalid Credentials.", 400));

  const token = jwt.sign({ id: findUser._id }, process.env.SECRET, {
    expiresIn: "5d",
  });

  res.json(token);
});

const getUserByUsername = catchAsync(async (req, res, next) => {
  const getUser = await User.findOne({ username: req.params.username });
  if (!getUser) return next(new expressError("User Not Found", 404));
  const { username, email, _id } = getUser;
  res.json({ _id, username, email });
});

const getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);
  if (!currentUser)
    return next(new expressError("Current User Not Found", 404));
  const { username, email, _id } = currentUser;
  res.json({ _id, username, email });
});

module.exports = {
  login,
  register,
  getUserByUsername,
  getCurrentUser,
};
