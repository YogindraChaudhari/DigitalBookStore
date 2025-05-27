const express = require("express");
const router = express.Router();
const {
  updateEmail,
  updatePassword,
  deleteAccount,
  getProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");

// Email update validation
const emailValidation = validate([
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
]);

// Password update validation
const passwordValidation = validate([
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage("Password must contain at least one letter and one number"),
]);

// Get user profile
router.get("/profile", auth, getProfile);

// Update email
router.put("/email", auth, emailValidation, updateEmail);

// Update password
router.put("/password", auth, passwordValidation, updatePassword);

// Delete account
router.delete("/delete", auth, deleteAccount);

module.exports = router;
