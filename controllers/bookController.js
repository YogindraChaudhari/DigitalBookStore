const Book = require("../models/Book");
const Review = require("../models/Review");

// Add new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, publishedYear } = req.body;

    // Create new book with user as creator
    const book = await Book.create({
      title,
      author,
      genre,
      description,
      publishedYear,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all books 
exports.getBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query with filters
    const queryObj = {};

    // Filter by author
    if (req.query.author) {
      queryObj.author = { $regex: req.query.author, $options: "i" };
    }

    // Filter by genre
    if (req.query.genre) {
      queryObj.genre = { $regex: req.query.genre, $options: "i" };
    }

    // Execute query with pagination
    const books = await Book.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await Book.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: books.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get book by ID with reviews
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find book by ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Pagination for reviews
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get reviews for this book
    const reviews = await Review.find({ bookId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username");

    // Calculate average rating
    const allReviews = await Review.find({ bookId });
    const totalRatings = allReviews.length;

    const averageRating =
      totalRatings > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalRatings
        : 0;

    // Get total count of reviews
    const totalReviews = await Review.countDocuments({ bookId });

    res.status(200).json({
      success: true,
      data: {
        ...book._doc,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews,
        reviews: {
          count: reviews.length,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalReviews / limit),
            totalResults: totalReviews,
          },
          data: reviews,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Search using text index or regex for partial matching
    const books = await Book.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await Book.countDocuments({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: books.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
