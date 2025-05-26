const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
CartSchema.pre("save", async function (next) {
  if (this.isModified("items")) {
    await this.populate("items.bookId");
    this.totalAmount = this.items.reduce((total, item) => {
      return total + item.bookId.price * item.quantity;
    }, 0);
  }
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
