const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const { UserValidation } = require("../validations/shcmeas");
const bcrypt = require("bcrypt");
const mongoId = require("mongoose").Types.ObjectId;
const transporter = require("../nodemailer");
const generateId = require("../utils/generateId");
const moment = require("moment");
const { cloudinary } = require("../cloudinary");

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
  if (req.body.username.length > 15) {
    return next(
      new expressError("Username Can't Be More Than 15 Characters.", 400)
    );
  }

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
  const { username, email, _id, profilePhoto, createdAt, hasPhoto } = getUser;
  res.json({ _id, username, email, profilePhoto, createdAt, hasPhoto });
});

const getCurrentUser = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID.", 400));
  const currentUser = await User.findById(req.user.id);
  if (!currentUser)
    return next(new expressError("Current User Not Found", 404));
  const {
    username,
    email,
    _id,
    createdAt,
    hasPhoto,
    profilePhoto,
  } = currentUser;
  res.json({ _id, username, email, createdAt, hasPhoto, profilePhoto });
});

const resetPassword = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID.", 400));
  const findUser = await User.findById(req.user.id);
  if (!findUser) return next(new expressError("User Not Found.", 404));
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword)
    return next(new expressError("Enter All Fields.", 400));
  if (oldPassword === newPassword)
    return next(
      new expressError("New Password Can't Be Same With Old Password.", 400)
    );
  if (newPassword.length < 6)
    return next(
      new expressError("Password Must Be More Than 6 Characters.", 400)
    );
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
  await User.deleteOne({ _id: req.user.id });
  if (findUser.hasPhoto)
    cloudinary.uploader.destroy(findUser.profilePhoto.filename);
  res.json("User Deleted.");
});

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const updateUserData = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.user.id))
    return next(new expressError("Enter Valid ID", 400));
  const findUser = await User.findById(req.user.id);
  if (!findUser) return next(new expressError("User Not Found.", 404));
  if (req.body.username.length < 1)
    return next(new expressError("Username Cant Be Blank.", 400));
  const getUsers = await User.find({
    _id: { $ne: req.user.id },
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (getUsers.length > 0)
    return next(new expressError("Try Different Username or Email.", 400));
  if (req.body.email) {
    if (req.body.email.length < 1)
      return next(new expressError("Email Can't Be Blank.", 400));
    if (!validateEmail(req.body.email))
      return next(new expressError("Enter Valid Email.", 400));
  }
  const file = req.file;
  const { removePhoto } = req.body;
  if (req.body.username.length > 15) {
    return next(
      new expressError("Username Can't Be More Than 15 Characters.", 400)
    );
  }
  const updateUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    req.body,
    { new: true }
  );
  if (req.body.username) {
    let newUsername = updateUser.username.split(" ").join(".");
    updateUser.username = newUsername;
    await updateUser.save();
  }
  if (file) {
    updateUser.profilePhoto = {
      url: file.path.replace("/upload", "/upload/w_400"),
      filename: file.filename,
    };
    updateUser.hasPhoto = true;
    await updateUser.save();
  }
  if (removePhoto) {
    updateUser.profilePhoto = {};
    updateUser.hasPhoto = false;
    await updateUser.save();
    cloudinary.uploader.destroy(findUser.profilePhoto.filename);
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
      msg: "Email Has Been Sent.",
      success: true,
    });
  } else {
    res.status(404).json({ msg: "Account Does Not Exist.", success: false });
  }
});

const checkResetPasswordToken = catchAsync(async (req, res, next) => {
  const { usernameOrEmail, userToken } = req.body;
  const getUser = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  });
  if (!getUser) return next(new expressError(false, 403));
  const {
    resetPassword: { token, expiration },
  } = getUser;
  if (moment(expiration).isAfter(Date.now())) {
    const compareToken = await bcrypt.compare(userToken, token);
    if (!compareToken) return next(new expressError(false, 403));
    return res.json(true);
  } else {
    getUser.resetPassword = {};
    await getUser.save();
    return next(new expressError(false, 403));
  }
});

const changePassword = catchAsync(async (req, res, next) => {
  const token = req.headers["password-token"];
  const { emailOrUsername } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword)
    return next(new expressError("Password can't be blank.", 400));
  if (newPassword.length < 6)
    return next(
      new expressError("Password must be at least 6 characters.", 400)
    );
  if (token.length > 8 || token.length < 8)
    return next(new expressError("redirect", 403));
  const getUser = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!getUser) return next(new expressError("redirect", 403));
  const { resetPassword } = getUser;
  if (moment(resetPassword.expiration).isBefore(Date.now()))
    return next(new expressError("redirect", 403));
  const compareToken = await bcrypt.compare(token, resetPassword.token);
  if (!compareToken) return next(new expressError("redirect", 403));
  if (newPassword !== confirmPassword)
    return next(new expressError("Passwords don't match.", 400));
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  getUser.password = hashedPassword;
  getUser.resetPassword = {};
  await getUser.save();
  res.json("Successfully changed the password.");
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
  changePassword,
  updateUserData,
};
