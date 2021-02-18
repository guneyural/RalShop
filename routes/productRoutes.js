const Router = require("express").Router();
const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const { isShop } = require("../middlewares/isAuth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

Router.post("/new", upload.array("images"), isShop, createProduct);
Router.put("/:id/update", isShop, updateProduct);
Router.delete("/:id/delete", isShop, deleteProduct);
Router.get("/:id", getProductById);

module.exports = Router;
