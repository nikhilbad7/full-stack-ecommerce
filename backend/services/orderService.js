const orderRepository = require("../repositories/orderRepository");
const AppError = require("../utils/AppError");

const getOrderById = async (orderId, userId) => {
  const rows = await orderRepository.getOrderById(orderId, userId);

  if (rows.length === 0) {
    throw new AppError("Order not found", 404);
  }

  const order = rows.reduce((result, row) => {
    if (!result) {
      result = {
        id: row.order_id,
        userId: row.user_id,
        total: Number(row.total_amount),
        createdAt: row.created_at,
        items: [],
      };
    }

    result.items.push({
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      price: Number(row.price),
    });

    return result;
  }, null);

  return order;
};

module.exports = {
  getOrderById,
};
