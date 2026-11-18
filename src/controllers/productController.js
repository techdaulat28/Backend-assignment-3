const mongoose = require("mongoose");
const Product = require("../models/Product");

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      filter.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (minStock !== undefined || maxStock !== undefined) {
      filter.stock = {};
      if (minStock !== undefined) filter.stock.$gte = Number(minStock);
      if (maxStock !== undefined) filter.stock.$lte = Number(maxStock);
    }

    const allowedSortFields = ["name", "category", "price", "stock", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = order.toLowerCase() === "asc" ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [safeSortBy]: sortDirection })
        .skip((currentPage - 1) * perPage)
        .limit(perPage),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const allowedFields = [
      "name",
      "sku",
      "category",
      "price",
      "stock",
      "lowStockThreshold",
      "supplier",
      "description"
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function adjustStock(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const { action, quantity } = req.body;
    const amount = Number(quantity);

    if (!["restock", "sale"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'action must be either "restock" or "sale"'
      });
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a positive whole number"
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (action === "sale" && product.stock < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${product.stock}`
      });
    }

    product.stock += action === "restock" ? amount : -amount;
    await product.save();

    res.status(200).json({
      success: true,
      message: action === "restock"
        ? "Stock restocked successfully"
        : "Sale recorded and stock reduced successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct
};