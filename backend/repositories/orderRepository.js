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

module.exports = {
  getOrderById,
};
