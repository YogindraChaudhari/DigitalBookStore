const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Get user's cart
router.get("/", auth, getCart);

// Add item to cart
router.post("/", auth, addToCart);

// Update cart item quantity
router.put("/", auth, updateCartItem);

// Remove item from cart
router.delete("/:bookId", auth, removeFromCart);

// Clear cart
router.delete("/", auth, clearCart);

module.exports = router;
