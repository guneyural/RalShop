const Router = require("express").Router();
const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerAllProducts,
  searchProduct,
} = require("../controllers/product");
const { isShop } = require("../middlewares/isAuth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

Router.get("/products/all", isShop, getSellerAllProducts);
Router.get("/search/:searchQuery", searchProduct);
Router.get("/:id", getProductById);
Router.post("/new", upload.array("images"), isShop, createProduct);
Router.put("/:id", isShop, upload.array("images"), updateProduct);
Router.delete("/:id", isShop, deleteProduct);

module.exports = Router;
