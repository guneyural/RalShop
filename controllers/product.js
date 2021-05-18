const Product = require("../models/product");
const Wishlist = require("../models/wishlist");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const mongoId = require("mongoose").Types.ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

  const getProduct = await Product.findById(req.params.id);
  if (!getProduct) return next(new expressError("Product Not Found", 404));
  if (getProduct.shop == req.shop.id) {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
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
    await Product.deleteOne({ _id: req.params.id });
    return res.json("Product Deleted");
  }
  return next(new expressError("You Are Not Owner Of This Product.", 403));
});

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
