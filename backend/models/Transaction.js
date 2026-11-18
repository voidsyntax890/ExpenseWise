const mongoose = require("mongoose");

const {
    INCOME_CATEGORIES,
    EXPENSE_CATEGORIES
} = require("../constants/categories");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: [true, "Transaction title is required"],
            trim: true
        },

        amountPaise: {
            type: Number,
            required: [true, "Transaction amount is required"],
            validate: {
                validator: function (value) {
                    return Number.isSafeInteger(value) && value > 0;
                },
                message: "Amount must be a positive integer in paise"
            }
        },

        type: {
            type: String,
            required: true,
            enum: ["income", "expense"]
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            validate: {
                validator: function (value) {
                    const allowedCategories =
                        this.type === "income"
                            ? INCOME_CATEGORIES
                            : this.type === "expense"
                                ? EXPENSE_CATEGORIES
                                : [];

                    return allowedCategories.includes(value);
                },
                message: "Invalid category for the selected transaction type"
            }
        },

        description: {
            type: String,
            trim: true
        },

        transactionDate: {
            type: Date,
            required: [true, "Transaction date is required"]
        }
    },
    {
        timestamps: true
    }
);

// Compound index for user-specific transaction history
transactionSchema.index({
    userId: 1,
    transactionDate: -1
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;