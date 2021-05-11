const Router = require("express").Router();
const { createPaymentIntent,  } = require("../controllers/stripe");
const { isUser } = require("../middlewares/isAuth");

Router.post("/create-payment-intent", isUser, createPaymentIntent);

module.exports = Router;
