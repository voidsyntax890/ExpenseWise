const express = require("express");

const {
    body,
    param,
    query
} = require("express-validator");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
    rupeesToPaise
} = require("../utils/money");

const {
    INCOME_CATEGORIES,
    EXPENSE_CATEGORIES
} = require("../constants/categories");

const {
    getTransactions,
    getTransactionSummary,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");

const router = express.Router();


// Every transaction route requires authentication.
router.use(protect);


// Reusable validation for creating and updating transactions.
const validateTransaction = [

    body("title")
        .isString()
        .withMessage("Title must be a string.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Transaction title is required.")
        .bail()
        .isLength({ max: 120 })
        .withMessage("Title cannot exceed 120 characters."),

    body("amount")
        .custom((value) => {
            try {
                rupeesToPaise(value);
                return true;
            } catch {
                throw new Error(
                    "Amount must be positive and have at most two decimal places."
                );
            }
        }),

    body("type")
        .isString()
        .withMessage("Transaction type is required.")
        .bail()
        .trim()
        .toLowerCase()
        .isIn(["income", "expense"])
        .withMessage("Type must be income or expense."),

    body("category")
        .isString()
        .withMessage("Category is required.")
        .bail()
        .trim()
        .custom((value, { req }) => {
            const allowedCategories =
                req.body.type === "income"
                    ? INCOME_CATEGORIES
                    : req.body.type === "expense"
                        ? EXPENSE_CATEGORIES
                        : [];

            if (!allowedCategories.includes(value)) {
                throw new Error(
                    "Invalid category for the selected transaction type."
                );
            }

            return true;
        }),

    body("transactionDate")
        .isString()
        .withMessage("Transaction date is required.")
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must use YYYY-MM-DD format.")
        .bail()
        .custom((value) => {
            const date = new Date(
                `${value}T00:00:00.000Z`
            );

            if (
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== value
            ) {
                throw new Error("Invalid calendar date.");
            }

            return true;
        }),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string.")
        .bail()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters.")
];


// Validate MongoDB transaction ID.
const validateTransactionId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid transaction ID.")
];


// GET all transactions with optional type filter.
router.get(
    "/",
    query("type")
        .optional()
        .isIn(["all", "income", "expense"])
        .withMessage("Type filter must be all, income, or expense."),
    validateRequest,
    getTransactions
);


// GET current-month financial summary.
// Keep this before GET /:id so "summary" is not treated as an ID.
router.get(
    "/summary",
    getTransactionSummary
);


// Create transaction.
router.post(
    "/",
    validateTransaction,
    validateRequest,
    createTransaction
);


// Retrieve one transaction.
router.get(
    "/:id",
    validateTransactionId,
    validateRequest,
    getTransactionById
);


// Update transaction.
router.put(
    "/:id",
    validateTransactionId,
    validateTransaction,
    validateRequest,
    updateTransaction
);


// Delete transaction.
router.delete(
    "/:id",
    validateTransactionId,
    validateRequest,
    deleteTransaction
);


module.exports = router;