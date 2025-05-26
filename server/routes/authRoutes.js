const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/validation");

// Register a new user
router.post("/signup", signupValidation, signup);

// Login user
router.post("/login", loginValidation, login);

module.exports = router;
