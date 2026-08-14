const { registerUser, loginUser } = require("../services/authService");

const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  const user = await registerUser({
    name,
    email,
    password,
  });

  res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await loginUser({
    email,
    password,
  });

  res.json(user);
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user.userId,
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
