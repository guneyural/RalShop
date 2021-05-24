const Product = require("../models/product");
const Order = require("../models/orders");
const Review = require("../models/review");
const Wishlist = require("../models/wishlist");
const Cart = require("../models/shoppingCart");
const Transporter = require("../nodemailer");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const mongoId = require("mongoose").Types.ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");

const createProduct = catchAsync(async (req, res, next) => {
  const {
    title,
    price,
    description,
    stock,
    category,
    subCategory,
    brand,
    colors,
    location,
    coordinate,
  } = req.body;
  if (
    !coordinate ||
    !title ||
    !price ||
    !description ||
    !stock ||
    !category ||
    !subCategory ||
    !brand ||
    !colors ||
    !location
  )
    return next(new expressError("Fill All Fields", 400));

  if (price > 999999) {
    return next(new expressError("Price must be less than $999.999", 400));
  }

  const stripeProduct = await stripe.products.create({
    name: title,
  });
  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: price * 100,
    currency: "usd",
  });

  const newProduct = new Product(req.body);
  newProduct.coordinate = coordinate.split(",");
  newProduct.stripeProductId = stripeProduct.id;
  newProduct.stripePriceId = stripePrice.id;
  newProduct.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newProduct.shop = req.shop.id;
  const product = await newProduct.save();
  res.status(201).json(product);
});
const getProductById = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));
  const getProduct = await Product.findById(req.params.id).populate("shop");
  if (!getProduct) return next(new expressError("Product Not Found", 404));
  const getWishlistCount = await Wishlist.find({
    products: { $in: [getProduct._id] },
  });
  res.json({
    Product: getProduct,
    wishlistCount: getWishlistCount.length,
  });
});
const updateProduct = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));

  if (
    !req.body.title ||
    !req.body.price ||
    !req.body.description ||
    !req.body.stock ||
    !req.body.brand ||
    !req.body.colors ||
    !req.body.location ||
    !req.body.coordinate ||
    !req.body.category ||
    !req.body.subCategory
  ) {
    return next(new expressError("Fill all fields", 400));
  }

  const getProduct = await Product.findById(req.params.id);
  if (!getProduct) return next(new expressError("Product Not Found", 404));
  if (getProduct.shop == req.shop.id) {
    let newImages = [];
    let oldImages = [];

    if (req.body.oldImages.length > 0) {
      oldImages = req.body.oldImages;
    }
    if (req.files.length > 0) {
      newImages = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
    }
    getProduct.images = [...newImages, ...JSON.parse(oldImages)].map((f) => ({
      url: f.url,
      filename: f.filename,
    }));
    getProduct.coordinate = req.body.coordinate.split(",");

    if (parseFloat(getProduct.price) !== parseFloat(req.body.price)) {
      const stripePrice = await stripe.prices.create({
        product: getProduct.stripeProductId,
        unit_amount: req.body.price * 100,
        currency: "usd",
      });
      getProduct.stripePriceId = stripePrice.id;
      getProduct.price = req.body.price;
    }
    await getProduct.save();

    const editProduct = await Product.findByIdAndUpdate(
      getProduct._id,
      {
        title: req.body.title,
        description: req.body.description,
        stock: req.body.stock,
        brand: req.body.brand,
        colors: req.body.colors,
        location: req.body.location,
        category: req.body.category,
        subCategory: req.body.subCategory,
      },
      { new: true }
    );
    res.status(200).json(editProduct);
  } else {
    next(new expressError("You Are Not Owner Of This Product.", 403));
  }
});
const deleteProduct = catchAsync(async (req, res, next) => {
  if (!mongoId.isValid(req.params.id))
    return next(new expressError("Enter Valid Id.", 400));

  const getProduct = await Product.findById(req.params.id);
  if (!getProduct) return next(new expressError("Product Not Found", 404));

  if (getProduct.shop == req.shop.id) {
    const getOrder = await Order.find({
      $and: [{ seller: req.shop.id }, { "Product.product": req.params.id }],
    });

    if (getOrder.length < 1) {
      await Cart.updateMany({ $pull: { items: { product: req.params.id } } });
      await Product.deleteOne({ _id: req.params.id });
      await Review.deleteMany({ productId: req.params.id });
      await Wishlist.updateMany({ $pull: { products: req.params.id } });
    } else {
      let firstEmail = {
        from: process.env.EMAIL,
        subject:
          "One Of The Product That You Ordered Has Deleted By The Seller",
        html: `<div style="margin:auto;background:white;border:1px solid #dedede;width:400px;padding:20px">
          <h1>One of the product that you ordered has deleted by the seller.</h1>
          <p>${
            getProduct.title
          } that you have ordered has been deleted by the seller. You paid ${priceConverter(
          getProduct.price
        )} for this product. You will be refunded.</p>
       `,
      };
      let secondEmail = { ...firstEmail };

      for (let item of getOrder) {
        const getSpecificOrder = await Order.findOne({ groupId: item.groupId });
        getSpecificOrder.note =
          getProduct.title +
          " Has been deleted by the seller. You've been refunded. You will only receive the product(s) remaining.";
        await getSpecificOrder.save();
        await item.remove();
        await stripe.refunds.create({
          payment_intent: item.paymentIntentId,
          amount: getProduct.price * 100,
        });

        if (item.billingAddress.email === item.deliveryAddress.email) {
          Transporter.sendMail(
            {
              ...firstEmail,
              to: item.billingAddress.email,
              html:
                firstEmail.html +
                `  You paid ${priceConverter(
                  item.totalAmount
                )} for the whole order, on ${moment(item.createdAt).format(
                  "ll"
                )}.
                <p>You will get refunded ${priceConverter(getProduct.price)}</p>
                <hr />
                <h3 style="text-align:center">UralShop</h3>
                <p style="text-align:center; font-size:11px;">Guney Ural @2021</p>
              </div>`,
            },
            () => Transporter.close()
          );
        } else {
          Transporter.sendMail(
            {
              ...firstEmail,
              to: item.billingAddress.email,
              html:
                firstEmail.html +
                `  You paid ${priceConverter(
                  item.totalAmount
                )} for the whole order, on ${moment(item.createdAt).format(
                  "ll"
                )}.
                <p>You will get refunded ${priceConverter(getProduct.price)}</p>
              <hr />
              <h3 style="text-align:center">UralShop</h3>
              <p style="text-align:center; font-size:11px;">Guney Ural @2021</p>
            </div>`,
            },
            () => Transporter.close()
          );
          Transporter.sendMail(
            {
              ...secondEmail,
              to: item.deliveryAddress.email,
              html:
                secondEmail.html +
                `  You paid ${priceConverter(
                  item.totalAmount
                )} for the whole order, on ${moment(item.createdAt).format(
                  "ll"
                )}.
                <p>You will get refunded ${priceConverter(getProduct.price)}</p>
              <hr />
              <h3 style="text-align:center">UralShop</h3>
              <p style="text-align:center; font-size:11px;">Guney Ural @2021</p>
            </div>`,
            },
            () => Transporter.close()
          );
        }
      }
    }

    await Cart.updateMany({ $pull: { items: { product: req.params.id } } });
    await Product.deleteOne({ _id: req.params.id });
    await Review.deleteMany({ productId: req.params.id });
    await Wishlist.updateMany({ $pull: { products: req.params.id } });
    return res.json("Product Deleted");
  }
  return next(new expressError("You Are Not Owner Of This Product.", 403));
});
const getSellerAllProducts = catchAsync(async (req, res) => {
  const shop = req.shop.id;
  const getAllProducts = await Product.find({ shop });
  let productData = [];

  for (let item of getAllProducts) {
    const getWishlistCount = await Wishlist.find({
      products: { $in: [item._id] },
    });
    const getOrders = await Order.find({ "Product.product": item._id });
    productData.push({
      item,
      ordersCount: getOrders.length,
      wishlistCount: getWishlistCount.length,
    });
  }

  res.status(200).json(productData);
});
const priceConverter = (number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(number);
};
const searchProduct = catchAsync(async (req, res, next) => {
  const query = req.params.searchQuery;
  const regex = new RegExp(escapeRegex(query), "gi");
  let results = { products: [], brands: [] };

  if (String(query.length)) {
    const findProducts = await Product.find({ title: regex }).populate("shop");
    const findBrands = await Product.find({ brand: regex }).populate("shop");

    findProducts.forEach((item, index) => {
      if (index <= 5) {
        results.products.push(item);
      }
    });

    findBrands.forEach((item, index) => {
      if (index <= 5) {
        results.brands.push(item);
      }
    });

    res.status(200).json(results);
  } else {
    return next(new expressError("You can not search empty text", 400));
  }
});
function escapeRegex(text) {
  return String(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerAllProducts,
  searchProduct,
};
