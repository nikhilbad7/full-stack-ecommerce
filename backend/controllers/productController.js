const products = require("../data/products");

const getProducts = (req, res) => {
  res.json(products);
};

const getProductById = (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};

module.exports = {
  getProducts,
  getProductById,
};
