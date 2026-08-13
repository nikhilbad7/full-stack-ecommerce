const express = require("express");

const {
  createProductController,
  getProducts,
  getProduct,
  updateProductController,
  deleteProductController,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProductController);
router.post("/", createProductController);
router.delete("/:id", deleteProductController);

module.exports = router;
