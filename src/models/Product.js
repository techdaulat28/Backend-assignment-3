const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must contain at least 2 characters"],
      maxlength: [120, "Product name cannot exceed 120 characters"]
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]+$/, "SKU can contain only letters, numbers and hyphens"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number"
      }
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low-stock threshold cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Low-stock threshold must be a whole number"
      }
    },
    supplier: {
      type: String,
      trim: true,
      maxlength: [120, "Supplier name cannot exceed 120 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text", sku: "text" });

module.exports = mongoose.model("Product", productSchema);