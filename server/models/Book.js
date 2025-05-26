const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: [0, "Year cannot be negative"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    coverImage: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isForSale: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Created text indexes for search functionality
BookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model("Book", BookSchema);
