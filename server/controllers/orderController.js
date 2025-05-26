const Cart = require("../models/Cart.js");
const Order = require("../models/Order.js");
const Book = require("../models/Book.js");

// Create order (checkout)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentId, items, totalAmount } = req.body;

    console.log("Order creation request:", {
      userId,
      shippingAddress,
      paymentId,
      items,
      totalAmount,
    });

    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // Verify all books exist and are for sale
    const bookIds = items.map((item) => item.bookId);
    const books = await Book.find({ _id: { $in: bookIds } });

    if (books.length !== bookIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more books not found",
      });
    }

    // Check if all books are for sale
    const notForSale = books.filter((book) => !book.isForSale);
    if (notForSale.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some books are not for sale: ${notForSale
          .map((b) => b.title)
          .join(", ")}`,
      });
    }

    // Create order items and verify prices
    const orderItems = items.map((item) => {
      const book = books.find((b) => b._id.toString() === item.bookId);

      // Verify price matches (security check)
      if (Math.abs(book.price - item.price) > 0.01) {
        throw new Error(
          `Price mismatch for book: ${book.title}. Expected: ${book.price}, Got: ${item.price}`
        );
      }

      return {
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity,
      };
    });

    // Calculate and verify total amount
    const calculatedTotal = orderItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Allow small floating point differences
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Total amount mismatch. Expected: ${calculatedTotal}, Got: ${totalAmount}`,
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      paymentId,
      paymentStatus: "completed", // Since we're using fake payment IDs
      status: "processing",
    });

    // Optional: Clear the user's cart from database if you're using backend cart
    try {
      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
      }
    } catch (cartError) {
      console.log("Cart clearing error (non-critical):", cartError.message);
      // Don't fail the order if cart clearing fails
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ userId });

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update payment status (webhook handler for payment gateway)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    const order = await Order.findOne({ paymentId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = status;
    if (status === "completed") {
      order.status = "processing";
    } else if (status === "failed") {
      order.status = "cancelled";
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user._id;

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
