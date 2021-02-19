const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Product = require("../models/product");
const mongoId = require("mongoose").Types.ObjectId;

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
  const newProduct = new Product(req.body);
  newProduct.coordinate = coordinate.split(",");
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
  const getProduct = await Product.findById(req.params.id);
  if (!getProduct) return next(new expressError("Product Not Found", 404));
  res.json(getProduct);
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
