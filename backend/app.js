require("dotenv").config();

const express = require("express");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
