const express = require("express");
const productRoutes = require("./routes/productRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory and Data Management System API",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      lowStockReport: "/api/reports/low-stock",
      categorySummary: "/api/reports/category-summary"
    }
  });
});

app.use("/api/products", productRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;