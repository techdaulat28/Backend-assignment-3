const Product = require("../models/Product");

async function lowStockReport(req, res, next) {
  try {
    const threshold = req.query.threshold !== undefined
      ? Number(req.query.threshold)
      : null;

    if (threshold !== null && (!Number.isInteger(threshold) || threshold < 0)) {
      return res.status(400).json({
        success: false,
        message: "threshold must be a non-negative whole number"
      });
    }

    const match = threshold === null
      ? { $expr: { $lte: ["$stock", "$lowStockThreshold"] } }
      : { stock: { $lte: threshold } };

    const products = await Product.find(match).sort({ stock: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      threshold: threshold === null ? "product-specific lowStockThreshold" : threshold,
      data: products
    });
  } catch (error) {
    next(error);
  }
}

async function categorySummary(req, res, next) {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 },
          totalUnits: { $sum: "$stock" },
          inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
          averagePrice: { $avg: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          productCount: 1,
          totalUnits: 1,
          inventoryValue: { $round: ["$inventoryValue", 2] },
          averagePrice: { $round: ["$averagePrice", 2] }
        }
      },
      { $sort: { inventoryValue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: summary.length,
      data: summary
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { lowStockReport, categorySummary };