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

const createProduct = (req, res) => {
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

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category,
    inStock,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};
