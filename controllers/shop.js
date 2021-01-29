const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { ShopValidation } = require("../validations/shcmeas");
const expressError = require("../utils/expressError");
const Shop = require("../models/shop");
const bcrypt = require("bcrypt");
const mongoId = require("mongoose").Types.ObjectId;

const createShop = catchAsync(async (req, res, next) => {
  const { name, email, password, description, image } = req.body;
  const { error } = ShopValidation.validate(req.body);
  if (!name) return next(new expressError("Shop Name Required.", 400));
  if (error)
    return next(
      new expressError(
        error.details[0].message.split(" ")[
          error.details[0].message.split(" ").length - 1
        ] === "email" && "Email Required.",
        400
      )
    );
  const findShopByName = await Shop.find({ name });
  const findShopByEmail = await Shop.find({ email });
  if (findShopByName)
    return next(new expressError("Shop With That Name Exists.", 400));
  if (findShopByEmail)
    return next(new expressError("Shop With That Email Exists.", 400));

  const newShop = new Shop(req.body);
  let saveShop = await newShop.save();
  const token = jwt.sign({ id: saveShop._id }, process.env.SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json(token);
});

const loginShop = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new expressError("Fill All Fields", 400));
  const getShop = await Shop.find({ email });
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
  res.json({
    name: getShop.name,
    email: getShop.email,
    description: getShop.description,
    image: getShop.image,
  });
});

const getCurrentShop = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.shop.id))
    return next(new expressError("Enter Valid ID.", 400));
  const getShop = await Shop.findById(req.shop.id);
  if (!getShop) return next(new expressError("Shop Does Not Exist.", 400));
  res.json({
    name: getShop.name,
    email: getShop.email,
    description: getShop.description,
    image: getShop.image,
  });
});

module.exports = {
  createShop,
  loginShop,
  getShopById,
  getCurrentShop,
};
