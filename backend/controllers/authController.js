const { registerUser } = require("../services/authService");
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

module.exports = {
  register,
};
