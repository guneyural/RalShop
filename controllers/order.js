const Order = require("../models/orders");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Transporter = require("../nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = catchAsync(async (req, res, next) => {
  const {
    billingAddress,
    deliveryAddress,
    invoiceId,
    paymentIntentId,
    seller,
    Product,
    totalAmount,
    groupId,
  } = req.body;
  const user = req.user;

  if (
    !billingAddress ||
    !deliveryAddress ||
    !invoiceId ||
    !paymentIntentId ||
    !seller ||
    !Product ||
    !totalAmount ||
    !groupId
  ) {
    return next(new expressError("Fill All Fields", 400));
  }

  const orderObject = new Order({
    billingAddress,
    deliveryAddress,
    user: user.id,
    seller,
    Product: {
      product: Product.product,
      color: Product.color,
      quantity: Product.quantity,
    },
    invoiceId,
    paymentIntentId,
    totalAmount,
    groupId,
    status: "waitingConfirmation",
  });
  const createdOrder = await orderObject.save();
  const populatedOrder = await createdOrder.execPopulate(
    "Product.product user seller"
  );
  const paymentIntent = await stripe.paymentIntents.retrieve(
    populatedOrder.paymentIntentId
  );
  res.status(200).json({
    groupId: populatedOrder.groupId,
    order: populatedOrder,
    Payment: paymentIntent,
  });
});
const getOrdersByUser = catchAsync(async (req, res) => {
  let orders = [];
  const getOrders = await Order.find({ user: req.user.id })
    .sort({
      createdAt: "desc",
    })
    .populate("Product.product user seller");

  for (let i = 0; i < getOrders.length; i++) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      getOrders[i].paymentIntentId
    );

    orders.push({
      groupId: getOrders[i].groupId,
      order: getOrders[i],
      Payment: paymentIntent.charges.data[0],
    });
  }

  res.status(200).json(orders);
});
const getOrdersBySeller = catchAsync(async (req, res) => {
  let orders = [];
  const getOrders = await Order.find({ seller: req.shop.id })
    .sort({ createdAt: "desc" })
    .populate("Product.product user seller");

  for (let i = 0; i < getOrders.length; i++) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      getOrders[i].paymentIntentId
    );

    orders.push({
      groupId: getOrders[i].groupId,
      order: getOrders[i],
      Payment: paymentIntent.charges.data[0],
    });
  }

  res.status(200).json(orders);
});
const orderCancelRequest = catchAsync(async (req, res, next) => {
  const { groupId } = req.body;
  let ordersArray = [];
  let productNames = [];

  const getOrders = await Order.find({
    $and: [{ user: req.user.id }, { groupId }],
  }).populate("Product.product user seller");

  if (getOrders.length < 1)
    return next(new expressError("Order could not found", 404));

  let paymentIntent;
  for (let [index, order] of getOrders.entries()) {
    if (order.status === "cancelRequest")
      return next(new expressError("Cancel request already sent", 400));

    if (index === 0) {
      paymentIntent = await stripe.paymentIntents.retrieve(
        order.paymentIntentId
      );
    }
    order.status = "cancelRequest";
    await order.save();
    ordersArray.push({
      groupId: order.groupId,
      order: order,
      Payment: paymentIntent.charges.data[0],
    });
    productNames.push(order.Product.product.title);
  }

  let text =
    "You requested to cancel the request. Your request has sent to the seller. If Seller approves, you will get refunded.";

  let mail = {
    from: process.env.EMAIL,
    to: getOrders[0].deliveryAddress.email,
    html: `
    <div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
      <h4>${text}</h4>
    </div>`,
    subject: `${productNames.join(", ")} Orders`,
  };

  Transporter.sendMail(mail, () => {
    Transporter.close();
  });

  return res.status(200).json(ordersArray);
});
const changeOrderStatus = catchAsync(async (req, res, next) => {
  const { groupId, status } = req.body;
  let newOrders = [];
  let productNames = [];

  const getOrder = await Order.find({
    $and: [{ groupId }, { seller: req.shop.id }],
  }).populate("Product.product user seller");

  if (!getOrder) return next(new expressError("Order could not found.", 404));

  for (let orderItem of getOrder) {
    orderItem.status = status;
    await orderItem.save();
    newOrders.push(orderItem);
    productNames.push(orderItem.Product.product.title);
  }

  let text = "";
  if (status === "waitingConfirmation")
    text = "Waiting confirmation by the seller for your orders";
  if (status === "confirmed") text = "Your orders confirmed by the seller";
  if (status === "cancelRequest")
    text =
      "You requested to cancel your order. If seller confirms, you will get refunded.";
  if (status === "cancelled") text = "Your orders are cancelled by the seller";
  if (status === "packing") text = "Your orders are packing.";
  if (status === "shipped") text = "Your orders are shipped";
  if (status === "delivered") text = "Your orders are delivered.";

  let mail = {
    from: process.env.EMAIL,
    to: getOrder[0].deliveryAddress.email,
    html: `
    <div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
      <h1>${text}</h1>
    </div>`,
    subject: `${productNames.join(", ")} Orders`,
  };

  Transporter.sendMail(mail, () => {
    Transporter.close();
  });

  res.status(200).json(newOrders);
});
const denyCancelRequest = catchAsync(async (req, res, next) => {
  const { groupId } = req.body;
  let newOrders = [];
  let productNames = [];

  const getOrders = await Order.find({
    $and: [{ groupId }, { seller: req.shop.id }, { status: "cancelRequest" }],
  }).populate("Product.product user seller");

  if (getOrders.length === 0)
    return next(new expressError("Order Not Found", 404));

  for (let orderItem of getOrders) {
    orderItem.status = "confirmed";
    orderItem.note = "Cancellation request denied by the seller.";
    await orderItem.save();
    newOrders.push(orderItem);
    productNames.push(orderItem.Product.product.title);
  }

  let text =
    "You requested to cancel your order. But seller denied your request. You can return products after you they are delivered.";

  let mail = {
    from: process.env.EMAIL,
    to: getOrders[0].deliveryAddress.email,
    html: `
    <div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
      <h5>${text}</h5>
    </div>`,
    subject: `${productNames.join(", ")} Orders`,
  };

  Transporter.sendMail(mail, () => {
    Transporter.close();
  });

  res.status(200).json(newOrders);
});
const refundOrder = catchAsync(async (req, res, next) => {
  const { groupId } = req.body;
  let newOrders = [];
  let productNames = [];

  const getOrders = await Order.find({
    $and: [{ groupId }, { seller: req.shop.id }],
  }).populate("Product.product user seller");

  if (getOrders.length === 0)
    return next(new expressError("Order Not Found", 404));

  for (let orderItem of getOrders) {
    orderItem.status = "cancelled";
    orderItem.note = "Order is cancelled.";
    await orderItem.save();
    newOrders.push(orderItem);
    productNames.push(orderItem.Product.product.title);
  }

  let text =
    "You requested to cancel your order and seller confirmed your cancellation request. Now you get refunded.";

  let mail = {
    from: process.env.EMAIL,
    to: getOrders[0].deliveryAddress.email,
    html: `
    <div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
      <h5>${text}</h5>
    </div>`,
    subject: `${productNames.join(", ")} Orders`,
  };

  Transporter.sendMail(mail, () => {
    Transporter.close();
  });

  try {
    await stripe.refunds.create({
      payment_intent: getOrders[0].paymentIntentId,
    });

    res.status(200).json(newOrders);
  } catch (e) {
    return next(new expressError("Error while refunding.", 400));
  }
});

module.exports = {
  createOrder,
  getOrdersBySeller,
  getOrdersByUser,
  changeOrderStatus,
  orderCancelRequest,
  refundOrder,
  denyCancelRequest,
};
