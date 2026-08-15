const express = require("express");
const {
  adminTest,
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.get("/admin-test", authMiddleware, requireRole("admin"), adminTest);

module.exports = router;
