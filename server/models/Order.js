const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  title: String,
  author: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

// const Cart = mongoose.model("Cart", CartSchema);
// const Order = mongoose.model("Order", OrderSchema);
module.exports = mongoose.model("Order", OrderSchema);

// module.exports = { Cart, Order };
