const express = require("express");

const {
  getOrder,
  createOrderController,
  getOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", authMiddleware, getOrder);

router.post("/", authMiddleware, createOrderController);

router.get("/", authMiddleware, getOrders);

module.exports = router;
