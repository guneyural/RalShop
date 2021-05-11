const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const chargeCustomer = async (customerId) => {
  // Lookup the payment methods available for the customer
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  // Charge the customer and payment method immediately
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
    customer: customerId,
    payment_method: paymentMethods.data[0].id,
    off_session: true,
    confirm: true,
  });
  if (paymentIntent.status === "succeeded") {
    console.log("✅ Successfully charged card off session");
  }
};

const createPaymentIntent = async (req, res) => {
  const { items, email, name, phone, shippingAddress, address } = req.body;

  const customer = await stripe.customers.create({
    email,
    name,
    invoice_settings: {
      footer:
        "Thanks for using UralShop. For more information send email to this address: guneyural@gmail.com",
    },
    phone,
    address: address,
    shipping: shippingAddress,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: "off_session",
    amount: 20000,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = { createPaymentIntent };
