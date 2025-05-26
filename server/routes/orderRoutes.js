const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updatePaymentStatus,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");

// Create order (checkout)
router.post("/", auth, createOrder);

// Get user's orders
router.get("/", auth, getUserOrders);

// Get order by ID
router.get("/:id", auth, getOrderById);

// Update payment status (webhook)
router.post("/payment-webhook", updatePaymentStatus);

module.exports = router;