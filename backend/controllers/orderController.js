const {
  getOrderById,
  createOrder,
  getOrdersByUserId,
} = require("../services/orderService");

const asyncHandler = require("../utils/asyncHandler");

const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user.userId);

  res.status(200).json(order);
});

const createOrderController = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.userId, req.body.items);

  res.status(201).json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUserId(req.user.userId);

  res.status(200).json(orders);
});

module.exports = {
  getOrder,
  createOrderController,
  getOrders,
};
