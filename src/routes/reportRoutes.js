const express = require("express");
const {
  lowStockReport,
  categorySummary
} = require("../controllers/reportController");

const router = express.Router();

router.get("/low-stock", lowStockReport);
router.get("/category-summary", categorySummary);

module.exports = router;