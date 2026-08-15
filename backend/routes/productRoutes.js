const express = require("express");

const {
  createProductController,
  getProducts,
  getProduct,
  updateProductController,
  deleteProductController,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateProductController,
);
router.post("/", authMiddleware, requireRole("admin"), createProductController);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteProductController,
);

module.exports = router;
