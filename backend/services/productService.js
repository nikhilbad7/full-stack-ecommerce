const pool = require("../db");
const AppError = require("../utils/AppError");

const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products ORDER BY id");

  return result.rows.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    category: product.category,
    inStock: product.in_stock,
    createdAt: product.created_at,
  }));
};

const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw new AppError("Product not found", 404);
  }

  const product = result.rows[0];

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    category: product.category,
    inStock: product.in_stock,
    createdAt: product.created_at,
  };
};

const createProduct = async ({ name, price, category, inStock }) => {
  const result = await pool.query(
    `INSERT INTO products (name, price, category, in_stock)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, price, category, inStock],
  );

  const product = result.rows[0];

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    category: product.category,
    inStock: product.in_stock,
    createdAt: product.created_at,
  };
};

const updateProduct = async (id, { name, price, category, inStock }) => {
  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         price = $2,
         category = $3,
         in_stock = $4
     WHERE id = $5
     RETURNING *`,
    [name, price, category, inStock, id],
  );

  if (result.rows.length === 0) {
    throw new AppError("Product not found", 404);
  }

  const product = result.rows[0];

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    category: product.category,
    inStock: product.in_stock,
    createdAt: product.created_at,
  };
};

const deleteProduct = async (id) => {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING id",
    [id],
  );

  if (result.rows.length === 0) {
    throw new AppError("Product not found", 404);
  }

  return true;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
