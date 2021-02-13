const Joi = require("joi");

const UserValidation = Joi.object({
  username: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const ShopValidation = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
  category: Joi.string().required(),
  companyName: Joi.string().required(),
  location: Joi.string().required(),
  coordinate: Joi.array().items(Joi.number()),
  links: Joi.array(),
  password: Joi.string().min(6).required(),
});

const CartValidation = Joi.object({
  items: Joi.array(),
  cartTotal: Joi.number(),
});

const ProductValidation = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  stock: Joi.number().required(),
  image: Joi.string().required(),
  shop: Joi.string(),
});

module.exports = {
  UserValidation,
  ShopValidation,
  CartValidation,
  ProductValidation,
};
