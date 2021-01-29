const Joi = require("joi");

const UserValidation = Joi.object({
  username: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const ShopValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  description: Joi.string(),
  image: Joi.string(),
});

const CartValidation = Joi.object({
  items: Joi.array(),
  cartTotal: Joi.number(),
});

const ProductValidation = Joi.object({
  title: Joi.string().required(),
  price: Joi.string().required(),
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
