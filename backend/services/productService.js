const products = require("../data/products");

const getAllProducts = () => {
  return products;
};

const getProductById = (id) => {
  return products.find((product) => product.id === Number(id));
};

const createProduct = ({ name, price, category, inStock }) => {
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category,
    inStock,
  };

  products.push(newProduct);

  return newProduct;
};

const updateProduct = (id, { name, price, category, inStock }) => {
  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return null;
  }

  product.name = name;
  product.price = price;
  product.category = category;
  product.inStock = inStock;

  return product;
};

const deleteProduct = (id) => {
  const index = products.findIndex((product) => product.id === Number(id));

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);

  return true;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
