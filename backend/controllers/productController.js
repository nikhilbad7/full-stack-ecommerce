const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const getProducts = (req, res) => {
  const products = getAllProducts();
  res.json(products);
};

const getProduct = (req, res) => {
  const product = getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};

const createProductController = (req, res) => {
  const { name, price, category, inStock } = req.body;

  if (!name || !category || price === undefined || inStock === undefined) {
    return res.status(400).json({
      message: "Name, price, category and inStock are required",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "Price must be a positive number",
    });
  }

  if (typeof inStock !== "boolean") {
    return res.status(400).json({
      message: "inStock must be a boolean",
    });
  }

  const newProduct = createProduct(req.body);

  res.status(201).json(newProduct);
};

const updateProductController = (req, res) => {
  const { name, price, category, inStock } = req.body;

  if (!name || !category || price === undefined || inStock === undefined) {
    return res.status(400).json({
      message: "Name, price, category and inStock are required",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "Price must be a positive number",
    });
  }

  if (typeof inStock !== "boolean") {
    return res.status(400).json({
      message: "inStock must be a boolean",
    });
  }

  const product = updateProduct(req.params.id, req.body);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};

const deleteProductController = (req, res) => {
  const deleted = deleteProduct(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(204).send();
};

module.exports = {
  createProductController,
  getProducts,
  getProduct,
  updateProductController,
  deleteProductController,
};
