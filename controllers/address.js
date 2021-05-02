const Address = require("../models/address");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Joi = require("joi");
const phone = Joi.extend(require("joi-phone-number"));

const createAddress = catchAsync(async (req, res, next) => {});
const getAddresses = catchAsync(async (req, res, next) => {});
const updateAddress = catchAsync(async (req, res, next) => {});
const deleteAddress = catchAsync(async (req, res, next) => {});

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};

/*let newPhone = "";
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
*/
