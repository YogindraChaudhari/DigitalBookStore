import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ShoppingBag,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCartStore();
  const { token } = useUserStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [address, setAddress] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else if (updateQuantity) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const checkout = async () => {
    if (!token) {
      toast.error("Please login to checkout");
      return;
    }

    // Add validation for paymentId and address
    if (!paymentId || !address) {
      toast.error("Payment ID and address are required");
      return;
    }

    // Check if cart is empty
    if (!cart || cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Send the entire cart items with all details since backend expects this format
          items: cart.map((item) => ({
            bookId: item._id,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity || 1,
          })),
          totalAmount: total,
          paymentId,
          shippingAddress: address,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Order placed successfully! 🎉");
      clearCart();
      setPaymentId("");
      setAddress("");
      setShowCheckoutModal(false);
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success("Cart cleared");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Shopping Cart
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            )}
          </div>
        </motion.div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center border border-gray-700/50"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Start shopping to add items to your cart
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all text-sm sm:text-base"
              onClick={() => window.history.back()}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Items in Cart
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="bg-gray-700/50 rounded-xl p-4 sm:p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all"
                    >
                      {/* Mobile layout for item (flex-col) */}
                      <div className="flex flex-col sm:hidden">
                        <div className="flex justify-between items-start mb-2">
                          {/* Title and Author */}
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-base font-semibold text-white mb-1 truncate">
                              {item.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-2 truncate">
                              by {item.author}
                            </p>
                          </div>
                          {/* Remove Button for Mobile - Top Right */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item._id)}
                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Price and Quantity on a new line for mobile */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600/50">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-gray-600/50 rounded-lg p-1 flex-shrink-0">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-500 rounded-md transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-300" />
                            </button>
                            <span className="w-6 text-center text-white font-semibold text-xs">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-500 rounded-md transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-300" />
                            </button>
                          </div>
                          {/* Subtotal */}
                          <div className="text-right min-w-[60px]">
                            <p className="text-base font-bold text-white truncate">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Desktop layout for item (hidden on mobile, flex-row on sm+) */}
                      <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
                        {/* Title and Author */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 truncate">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2 truncate">
                            by {item.author}
                          </p>
                          <p className="text-green-400 font-semibold text-base">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-600/50 rounded-lg p-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-500 rounded-md transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-300" />
                            </button>
                            <span className="w-8 text-center text-white font-semibold">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-500 rounded-md transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-300" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right min-w-[80px]">
                            <p className="text-xl font-bold text-white">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button for Desktop - Far Right */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item._id)}
                            className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Cart Summary */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </h2>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-gray-600 pt-2 sm:pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-green-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCheckoutModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>
          </>
        )}
      </div>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => !isProcessing && setShowCheckoutModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Confirm Order
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Review your order details and provide payment info
                  </p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                  <span className="text-gray-300">Total Items:</span>
                  <span className="text-white font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-300">Total Amount:</span>
                  <span className="text-green-400 font-bold text-base sm:text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment and Address Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="paymentId"
                    className="block text-gray-300 text-sm font-semibold mb-1"
                  >
                    Payment ID
                  </label>
                  <input
                    type="text"
                    id="paymentId"
                    placeholder="e.g., pay_fake_123"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-300 text-sm font-semibold mb-1"
                  >
                    Shipping Address
                  </label>
                  <textarea
                    id="address"
                    placeholder="Your full shipping address"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[80px]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  disabled={isProcessing}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors font-bold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={checkout}
                  disabled={isProcessing || !paymentId || !address} // Disable if fields are empty
                  className="flex-1 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-bold flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="hidden sm:inline">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Place Order</span>
                      <span className="sm:hidden">Order</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Cart Confirmation Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowClearModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Clear Cart
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to remove all items from your cart? You'll
                lose all {totalItems} items.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold text-sm sm:text-base"
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
