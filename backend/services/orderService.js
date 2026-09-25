const pool = require("../db");
const orderRepository = require("../repositories/orderRepository");
const AppError = require("../utils/AppError");

const validateOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Order must contain at least one item", 400);
  }

  const productIds = new Set();

  for (const item of items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new AppError("Invalid product ID", 400);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new AppError("Quantity must be a positive integer", 400);
    }

    if (productIds.has(item.productId)) {
      throw new AppError(`Duplicate product ID: ${item.productId}`, 400);
    }

    productIds.add(item.productId);
  }
};

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

const createOrder = async (userId, items) => {
  validateOrderItems(items);

  const productIds = items.map((item) => item.productId);

  const products = await orderRepository.getProductsForOrder(productIds);

  if (products.length !== productIds.length) {
    throw new AppError("One or more products not found", 404);
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  let total = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product.in_stock) {
      throw new AppError(`Product ${product.id} is out of stock`, 409);
    }

    total += Number(product.price) * item.quantity;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const order = await orderRepository.createOrder(client, userId, total);

    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
      };
    });

    await orderRepository.createOrderItems(client, order.id, orderItems);

    await client.query("COMMIT");

    return {
      id: order.id,
      userId: order.user_id,
      total: Number(order.total_amount),
      createdAt: order.created_at,
      items: orderItems,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getOrdersByUserId = async (userId) => {
  const rows = await orderRepository.getOrdersByUserId(userId);

  const ordersMap = new Map();

  for (const row of rows) {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        id: row.order_id,
        userId: row.user_id,
        total: Number(row.total_amount),
        createdAt: row.created_at,
        items: [],
      });
    }

    const order = ordersMap.get(row.order_id);

    order.items.push({
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      price: Number(row.price),
    });
  }

  return Array.from(ordersMap.values());
};
module.exports = {
  getOrderById,
  createOrder,
  getOrdersByUserId,
};
