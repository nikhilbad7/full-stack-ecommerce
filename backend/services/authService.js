const bcrypt = require("bcrypt");
const pool = require("../db");
const AppError = require("../utils/AppError");

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

module.exports = {
  registerUser,
};
