const pool = require("../db");

const getOrderById = async (orderId, userId) => {
  const result = await pool.query(
    `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.total_amount,
      o.created_at,
      oi.product_id,
      p.name AS product_name,
      oi.quantity,
      oi.price
    FROM orders o
    INNER JOIN order_items oi
      ON o.id = oi.order_id
    INNER JOIN products p
      ON oi.product_id = p.id
    WHERE o.id = $1
      AND o.user_id = $2
    ORDER BY oi.id
    `,
    [orderId, userId],
  );

  return result.rows;
};

const getProductsForOrder = async (productIds) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      price,
      in_stock
    FROM products
    WHERE id = ANY($1)
    `,
    [productIds],
  );

  return result.rows;
};

const createOrder = async (client, userId, total) => {
  const result = await client.query(
    `
    INSERT INTO orders (user_id, total_amount)
    VALUES ($1, $2)
    RETURNING id, user_id, total_amount, created_at
    `,
    [userId, total],
  );

  return result.rows[0];
};

const createOrderItems = async (client, orderId, items) => {
  for (const item of items) {
    await client.query(
      `
      INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        price
      )
      VALUES ($1, $2, $3, $4)
      `,
      [orderId, item.productId, item.quantity, item.price],
    );
  }
};

const getOrdersByUserId = async (userId, limit, offset) => {
  const result = await pool.query(
    `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.total_amount,
      o.created_at,
      oi.product_id,
      p.name AS product_name,
      oi.quantity,
      oi.price
    FROM (
      SELECT
        id,
        user_id,
        total_amount,
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2
      OFFSET $3
    ) o
    INNER JOIN order_items oi
      ON o.id = oi.order_id
    INNER JOIN products p
      ON oi.product_id = p.id
    ORDER BY o.created_at DESC, o.id DESC, oi.id
    `,
    [userId, limit, offset],
  );

  const countResult = await pool.query(
    `
  SELECT COUNT(*) AS total
  FROM orders
  WHERE user_id = $1
  `,
    [userId],
  );

  return {
    rows: result.rows,
    total: Number(countResult.rows[0].total),
  };
};

module.exports = {
  getOrderById,
  getProductsForOrder,
  createOrder,
  createOrderItems,
  getOrdersByUserId,
};
