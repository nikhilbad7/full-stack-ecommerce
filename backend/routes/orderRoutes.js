const express = require("express");

const {
  getOrder,
  createOrderController,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", authMiddleware, getOrder);

router.post("/", authMiddleware, createOrderController);

module.exports = router;
