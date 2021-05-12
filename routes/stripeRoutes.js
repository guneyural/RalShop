const Router = require("express").Router();
const { createPaymentIntent, createInvoice } = require("../controllers/stripe");
const { isUser } = require("../middlewares/isAuth");

Router.post("/create-payment-intent", isUser, createPaymentIntent);
Router.post("/create-invoice", isUser, createInvoice);

module.exports = Router;
