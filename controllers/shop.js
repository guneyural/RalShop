const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { ShopValidation } = require("../validations/shcmeas");
const expressError = require("../utils/expressError");
const Shop = require("../models/shop");
const bcrypt = require("bcrypt");
const mongoId = require("mongoose").Types.ObjectId;
const Joi = require("joi");
const phone = Joi.extend(require("joi-phone-number"));

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

module.exports = {
  createShop,
  loginShop,
  getShopById,
  getCurrentShop,
};
