const express = require("express");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const {
    register,
    login,
    logout,
    getMe
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Too many registration attempts. Try again later."
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Too many login attempts. Try again later."
    }
});

// Registration validation
const registerValidation = [
    body("name")
        .isString()
        .withMessage("Name must be text.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .bail()
        .isLength({ max: 80 })
        .withMessage("Name cannot exceed 80 characters."),

    body("email")
        .isString()
        .withMessage("Valid email is required.")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address.")
        .bail()
        .customSanitizer(value => value.toLowerCase()),

    body("password")
        .isString()
        .withMessage("Password is required.")
        .bail()
        .custom(value => {
            const length = Buffer.byteLength(value, "utf8");
            return length >= 8 && length <= 72;
        })
        .withMessage("Password must contain 8–72 UTF-8 bytes.")
];

// Login validation
const loginValidation = [
    body("email")
        .isString()
        .withMessage("Valid email is required.")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address.")
        .bail()
        .customSanitizer(value => value.toLowerCase()),

    body("password")
        .isString()
        .withMessage("Password is required.")
        .bail()
        .notEmpty()
        .withMessage("Password cannot be empty.")
];

// Routes

router.post(
    "/register",
    registerLimiter,
    registerValidation,
    validateRequest,
    register
);

router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validateRequest,
    login
);

router.post("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;