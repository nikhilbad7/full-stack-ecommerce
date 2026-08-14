require("dotenv").config();
const express = require("express");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());

const PORT = 5000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
  });
});

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
