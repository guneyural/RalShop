const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Cart = require("../models/shoppingCart");

const createCard = catchAsync(async (req, res, next) => {});
const addToCard = catchAsync(async (req, res, next) => {});
const deleteCard = catchAsync(async (req, res, next) => {});
const getCard = catchAsync(async (req, res, next) => {});

module.exports = {
  createCard,
  addToCard,
  deleteCard,
  getCard,
};
