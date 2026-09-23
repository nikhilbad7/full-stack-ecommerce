const { getOrderById } = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");

const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user.userId);

  res.json(order);
});

module.exports = {
  getOrder,
};
