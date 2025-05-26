const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  getBookById,
  searchBooks,
  getUserBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { addReview } = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const {
  bookValidation,
  reviewValidation,
} = require("../middleware/validation");

// Add a new book - protected route
router.post("/", auth, bookValidation, addBook);

// Get all books
router.get("/", getBooks);

// Get user's books - protected route
router.get("/my-books", auth, getUserBooks);

// Search books by title or author
router.get("/search", searchBooks);

// Get book by ID with reviews
router.get("/:id", getBookById);

// Update book - protected route
router.put("/:id", auth, bookValidation, updateBook);

// Delete book - protected route
router.delete("/:id", auth, deleteBook);

// Add a review to a book
router.post("/:id/reviews", auth, reviewValidation, addReview);

module.exports = router;
