const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const asyncHandler = require("../utils/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const products = await getAllProducts();

  res.json(products);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);

  res.json(product);
});

const createProductController = asyncHandler(async (req, res) => {
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

  const newProduct = await createProduct(req.body);

  res.status(201).json(newProduct);
});

const updateProductController = asyncHandler(async (req, res) => {
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

  const product = await updateProduct(req.params.id, req.body);

  res.json(product);
});

const deleteProductController = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);

  res.status(204).send();
});

module.exports = {
  createProductController,
  getProducts,
  getProduct,
  updateProductController,
  deleteProductController,
};
