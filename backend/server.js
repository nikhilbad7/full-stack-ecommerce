const products = require("./data/products");

const express = require("express");

const app = express();

const PORT = 5000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
  });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
