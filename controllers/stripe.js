const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const {
    items,
    email,
    name,
    phone,
    shippingAddress,
    address,
    shippingFee,
  } = req.body;
  let totalAmount = 0;

  items.forEach((item) => {
    totalAmount += item.price;
  });

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
    amount: (totalAmount + shippingFee) * 100, // totalAmount * 100 because stripe accepts amounts in cents
    currency: "usd",
  });

  res.send({
    customer: customer.id,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });
};

const createInvoice = async (req, res) => {
  const { items, paymentIntentId, customerId } = req.body;

  for (let i = 0; i < items.length; i++) {
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      price: items[i].stripePriceId,
      quantity: items[i].qty,
    });
  }

  const shippingFee = await stripe.invoiceItems.create({
    customer: customerId,
    price: "price_1IqKpWK1OZzqDEnoqTc0zlDr",
  });

  const invoice = await stripe.invoices.create({
    customer: customerId,
  });

  const finalizeInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
  const payInvoice = await stripe.invoices.pay(invoice.id, {
    paid_out_of_band: true,
  });
  res.json();
};

module.exports = { createPaymentIntent, createInvoice };
