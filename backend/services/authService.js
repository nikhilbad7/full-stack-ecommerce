const bcrypt = require("bcrypt");
const pool = require("../db");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash],
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new AppError("Email already registered", 409);
    }

    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [email],
  );

  if (result.rows.length === 0) {
    throw new AppError("Invalid email or password", 401);
  }

  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  loginUser,
  registerUser,
};
