const Router = require("express").Router();
const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const { isShop } = require("../middlewares/isAuth");

Router.post("/new", isShop, createProduct);
Router.put("/:id/update", isShop, updateProduct);
Router.delete("/:id/delete", isShop, deleteProduct);
Router.get("/:id", getProductById);

module.exports = Router;
