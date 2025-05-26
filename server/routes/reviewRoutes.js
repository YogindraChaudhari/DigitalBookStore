const express = require("express");
const router = express.Router();
const {
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const { reviewValidation } = require("../middleware/validation");

// Update a review
router.put("/:id", auth, reviewValidation, updateReview);

// Delete a review
router.delete("/:id", auth, deleteReview);

module.exports = router;
