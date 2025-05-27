const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Book = require("../models/Book");

// Update user email
exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user._id;

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if email is already in use by another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use by another account",
      });
    }

    // Update user email
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: email.toLowerCase() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    // Validate password length
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user and update password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password (will be hashed by the pre-save middleware)
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Start a transaction to ensure all deletions succeed or fail together
    const session = await User.startSession();

    try {
      await session.withTransaction(async () => {
        // Delete user's cart
        await Cart.deleteOne({ userId }, { session });

        // Delete user's orders
        await Order.deleteMany({ userId }, { session });

        // Delete user's reviews
        await Review.deleteMany({ userId }, { session });

        // Delete books created by the user
        await Book.deleteMany({ createdBy: userId }, { session });

        // Finally, delete the user account
        const deletedUser = await User.findByIdAndDelete(userId, { session });

        if (!deletedUser) {
          throw new Error("User not found");
        }
      });

      await session.endSession();

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (transactionError) {
      await session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

// Get user profile (optional - for getting current user info)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
