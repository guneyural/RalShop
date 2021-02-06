const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const { UserValidation } = require("../validations/shcmeas");
const bcrypt = require("bcrypt");
const mongoId = require("mongoose").Types.ObjectId;
const transporter = require("../nodemailer");
const generateId = require("../utils/generateId");

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
  if (findUserByEmail)
    return next(new expressError("Try Different Email.", 400));
  if (findUserByUsername)
    return next(new expressError("Try Different Username.", 400));

  const createUser = new User(req.body);
  const hash = await bcrypt.hash(createUser.password, 10);
  createUser.password = hash;
  let newUsername = createUser.username.split(" ").join(".");
  createUser.username = newUsername;
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
  if (!findUser) return next(new expressError("Wrong Password Or Email.", 404));

  const comparePassword = await bcrypt.compare(password, findUser.password);
  if (!comparePassword)
    return next(new expressError("Wrong Password Or Email.", 400));

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
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID.", 400));
  const currentUser = await User.findById(req.user.id);
  if (!currentUser)
    return next(new expressError("Current User Not Found", 404));
  const { username, email, _id } = currentUser;
  res.json({ _id, username, email });
});

const resetPassword = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID.", 400));
  const findUser = await User.findById(req.user.id);
  if (!findUser) return next(new expressError("User Not Found.", 404));
  const { oldPassword, newPassword } = req.body;
  const isMatch = await bcrypt.compare(oldPassword, findUser.password);
  if (!isMatch) return next(new expressError("Wrong Password.", 400));
  const hashPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hashPassword });
  const emailOptions = {
    from: process.env.EMAIL,
    to: findUser.email,
    subject: "Email Changed.",
    text: `Your password has changed.`,
  };
  transporter.sendMail(emailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info);
    }
  });
  res.json("Password Changed.");
});

const removeUser = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID", 400));
  const findUser = await User.findById(req.user.id);
  if (!findUser) return next(new expressError("User Not Found.", 404));
  const { password } = req.body;
  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) return next(new expressError("Wrong Password", 400));
  await User.findOneAndDelete({ _id: req.user.id });
  res.json("User Deleted.");
});

const updateUserData = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID", 400));
  const findUser = await User.findById(req.user.id);
  if (!findUser) return next(new expressError("User Not Found.", 404));
  const getUsers = await User.find({
    _id: { $ne: req.user.id },
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (getUsers.length > 0)
    return next(new expressError("Try Different Username or Email.", 400));
  const file = req.file;
  const { removePhoto } = req.body;
  const updateUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    req.body,
    { new: true }
  );
  if (file) {
    updateUser.profilePhoto = { url: file.path, filename: file.filename };
    updateUser.hasPhoto = true;
    await updateUser.save();
  }
  if (removePhoto) {
    updateUser.profilePhoto = {};
    updateUser.hasPhoto = false;
    await updateUser.save();
  }
  if (updateUser.email !== findUser.email) {
    const emailOptions = {
      from: process.env.EMAIL,
      to: updateUser.email,
      subject: "Email Changed.",
      html: `<div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
      <p>Email address of @${updateUser.username} changed.</p>
      <p><b>${updateUser.email}</b> is valid email.</p>
      <hr />
        <h3 style="text-align:center">UralShop</h3>
        <p style="text-align:center; font-size:11px;">Guney Ural @2021</p>
      </div>`,
    };

    transporter.sendMail(emailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info);
      }
    });

    const secondEmailOptions = {
      from: process.env.EMAIL,
      to: findUser.email,
      subject: "Email Changed.",
      html: `<div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
      <p><b>${findUser.email}</b> address changed to <b>${updateUser.email}</b>. Now <b>${updateUser.email}</b> is valid email.</p>
      <hr />
        <h3 style="text-align:center">UralShop</h3>
        <p style="text-align:center; font-size:11px;">Guney Ural @2021</p>
      </div>`,
    };

    transporter.sendMail(secondEmailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info);
      }
    });
  }
  res.json(updateUser);
});

const sendForgetPasswordEmail = catchAsync(async (req, res) => {
  const { emailOrUsername } = req.body;
  const getAccount = await User.findOne({
    $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
  });
  if (getAccount) {
    const token = generateId(8);
    const hashedToken = await bcrypt.hash(token, 2);
    let currentDate = new Date();
    let futureDate = new Date(currentDate.getTime() + 5 * 60000);
    getAccount.resetPassword = { token: hashedToken, expiration: futureDate };
    await getAccount.save();

    const emailOptions = {
      from: process.env.EMAIL,
      to: getAccount.email,
      subject: "Password Reset Request.",
      html: `<div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
        <h1>Reset Your Password?</h1>
        <p>If you have sent password reset request for @${getAccount.username} copy bold text down there which is your confirmation code.</p>
        <p>If you didn't make this request ignore this email.</p>
        <h2><strong>${token}</strong></h2>
        <hr />
        <h3 style="text-align:center">UralShop</h3>
        <p style="text-align:center; font-size:11px;">Guney Ural @2021</p>
      </div>`,
    };

    transporter.sendMail(emailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
      transporter.close();
    });
    res.json({
      msg: "Email Has Been Sent If Account Exists.",
    });
  } else {
    res.json({ msg: "Email Has Been Sent If Account Exists." });
  }
});

const checkResetPasswordToken = catchAsync(async (req, res, next) => {
  // Get Mail Address in url param
  // Check expiration date
  // Get id from url param compare it if true return true
});

module.exports = {
  login,
  register,
  getUserByUsername,
  getCurrentUser,
  resetPassword,
  sendForgetPasswordEmail,
  checkResetPasswordToken,
  removeUser,
  updateUserData,
};
