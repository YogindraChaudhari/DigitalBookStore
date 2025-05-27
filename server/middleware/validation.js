const { body, validationResult } = require("express-validator");

// Validation middleware factory
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  };
};

// User registration validation
const signupValidation = validate([
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
]);

// Login validation
const loginValidation = validate([
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password").exists().withMessage("Password is required"),
]);

// Book validation
const bookValidation = validate([
  body("title").trim().notEmpty().withMessage("Book title is required"),
  body("author").trim().notEmpty().withMessage("Author name is required"),
  body("publishedYear")
    .optional()
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage(`Year must be between 0 and ${new Date().getFullYear()}`),
]);

// Review validation
const reviewValidation = validate([
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().trim(),
]);

// Email update validation
const emailUpdateValidation = validate([
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
]);

// Password update validation
const passwordUpdateValidation = validate([
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage("Password must contain at least one letter and one number"),
]);

module.exports = {
  validate,
  signupValidation,
  loginValidation,
  bookValidation,
  reviewValidation,
  emailUpdateValidation,
  passwordUpdateValidation,
};
