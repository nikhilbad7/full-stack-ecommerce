const jwt = require("jsonwebtoken");

const createTestToken = ({ userId = 1, role = "admin" } = {}) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

module.exports = createTestToken;
