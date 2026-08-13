const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.post("/", createProduct);

module.exports = router;
