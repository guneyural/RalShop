const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { ShopValidation } = require("../validations/shcmeas");
const expressError = require("../utils/expressError");
const Shop = require("../models/shop");
const bcrypt = require("bcrypt");
const mongoId = require("mongoose").Types.ObjectId;
const Joi = require("joi");
const phone = Joi.extend(require("joi-phone-number"));
const transporter = require("../nodemailer");
const generateId = require("../utils/generateId");
const moment = require("moment");

const createShop = catchAsync(async (req, res, next) => {
  const {
    fullname,
    email,
    country,
    phoneNumber,
    category,
    companyName,
    location,
    links,
    password,
    coordinate,
  } = req.body;
  const { error } = ShopValidation.validate({
    fullname,
    email,
    country,
    category,
    companyName,
    location,
    coordinate,
    links,
    password,
  });
  if (
    category === "" ||
    !category ||
    country === "" ||
    !country ||
    !fullname ||
    !email ||
    !companyName ||
    !location ||
    !password ||
    !phoneNumber
  ) {
    return next(new expressError("Enter All Fields.", 400));
  }
  if (password.length < 6)
    return next(
      new expressError("Password Must Be At Least 6 Characters.", 400)
    );
  if (error) {
    console.log(error);
    return next(
      new expressError(
        error.details[0].message.split(" ")[
          error.details[0].message.split(" ").length - 1
        ] === "email" && "Email Must Be A Valid Email.",
        400
      )
    );
  }
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (links[0] !== "") {
    links.forEach((url) => {
      if (!url.match(regex)) {
        return next(new expressError("Enter Valid Link", 400));
      }
    });
  }

  let newPhone = "";
  const checkPhone = phone
    .string()
    .phoneNumber({
      defaultCountry: country,
      strict: true,
      format: "international",
    })
    .validate(phoneNumber);
  if (checkPhone.error)
    return next(new expressError("Enter Valid Phone Number.", 400));
  else newPhone = checkPhone.value;

  const findShopByName = await Shop.findOne({ companyName });
  const findShopByEmail = await Shop.findOne({ email });
  if (findShopByName)
    return next(new expressError("Shop With That Company Name Exists.", 400));
  if (findShopByEmail)
    return next(new expressError("Shop With That Email Exists.", 400));

  const newShop = new Shop(req.body);
  const hashed = await bcrypt.hash(newShop.password, 10);
  newShop.password = hashed;
  newShop.phoneNumber = newPhone;
  let saveShop = await newShop.save();
  const token = jwt.sign({ id: saveShop._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  res.status(201).json(token);
});

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const loginShop = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new expressError("Fill All Fields", 400));
  if (!validateEmail(email))
    return next(new expressError("Enter Valid Email.", 400));
  const getShop = await Shop.findOne({ email });
  if (!getShop) return next(new expressError("Shop Does Not Exist.", 404));

  const comparePassword = await bcrypt.compare(password, getShop.password);
  if (!comparePassword)
    return next(new expressError("Invalid Credentials", 400));

  const token = jwt.sign({ id: getShop._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  res.json(token);
});

const getShopById = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid ID.", 400));
  const getShop = await Shop.findById(req.params.id);
  if (!getShop) return next(new expressError("Shop Does Not Exist.", 400));
  const {
    _id,
    fullName,
    email,
    country,
    phoneNumber,
    category,
    companyName,
    location,
    coordinate,
    links,
  } = getShop;
  res.json({
    id: _id,
    fullName,
    email,
    country,
    phoneNumber,
    category,
    companyName,
    location,
    coordinate,
    links,
  });
});

const getCurrentShop = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.shop.id))
    return next(new expressError("Enter Valid ID.", 400));
  const getShop = await Shop.findById(req.shop.id);
  if (!getShop) return next(new expressError("Shop Does Not Exist.", 400));
  const {
    _id,
    fullName,
    email,
    country,
    phoneNumber,
    category,
    companyName,
    location,
    coordinate,
    links,
  } = getShop;
  res.json({
    id: _id,
    fullName,
    email,
    country,
    phoneNumber,
    category,
    companyName,
    location,
    coordinate,
    links,
  });
});

const sendForgetPasswordEmail = catchAsync(async (req, res, next) => {
  const { email, origin } = req.body;
  const getShop = await Shop.findOne({ email });
  if (getShop) {
    const token = generateId(8);
    const hashedToken = await bcrypt.hash(token, 2);
    let currentDate = new Date();
    let futureDate = new Date(currentDate.getTime() + 5 * 60000);
    getShop.resetPassword = { token: hashedToken, expiration: futureDate };
    await getShop.save();

    const emailOptions = {
      from: process.env.EMAIL,
      to: getShop.email,
      subject: "Password Reset Request.",
      html: `<div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
        <h1>Reset Your Password?</h1>
        <p>If you have sent password reset request for shop named ${getShop.companyName} click link below which sends you to password reset page.</p>
        <p>If you didn't make this request ignore this email.</p>
        <a href="${origin}/seller/forgot_password/reset_password/${token}">Reset Your Password</a>
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
    return next(new expressError("Shop Does Not Exists.", 404));
  }
});

const checkResetPasswordToken = catchAsync(async (req, res, next) => {
  const { email, shopToken } = req.body;
  const getShop = await Shop.findOne({ email });
  if (!getShop) return next(new expressError(false, 404));
  const {
    resetPassword: { token, expiration },
  } = getShop;
  if (moment(expiration).isAfter(Date.now())) {
    const compareToken = await bcrypt.compare(shopToken, token);
    if (!compareToken) return next(new expressError(false, 403));
    return res.json(true);
  } else {
    getShop.resetPassword = {};
    await getShop.save();
    return next(new expressError(false, 403));
  }
});

const changePassword = catchAsync(async (req, res, next) => {
  const token = req.headers["password-token"];
  const { newPassword, confirmPassword, email } = req.body;
  if (!newPassword || !confirmPassword)
    return next(new expressError("Password can't be blank.", 400));
  if (newPassword.length < 6)
    return next(
      new expressError("Password must be at least 6 characters.", 400)
    );
  if (token.length > 8 || token.length < 8)
    return next(new expressError("redirect", 403));
  const getShop = await Shop.findOne({ email });
  if (!getShop) return next(new expressError(false, 404));
  const { resetPassword } = getShop;
  if (moment(resetPassword.expiration).isBefore(Date.now()))
    return next(new expressError("redirect", 403));
  const compareToken = await bcrypt.compare(token, resetPassword.token);
  if (!compareToken) return next(new expressError("redirect", 403));
  if (newPassword !== confirmPassword)
    return next(new expressError("Passwords don't match.", 400));
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  getShop.password = hashedPassword;
  getShop.resetPassword = {};
  await getShop.save();
  res.json("Successfully changed the password.");
});

module.exports = {
  createShop,
  loginShop,
  getShopById,
  getCurrentShop,
  sendForgetPasswordEmail,
  checkResetPasswordToken,
  changePassword,
};
