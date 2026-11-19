const Transaction = require("../models/Transaction");

const {
    rupeesToPaise,
    paiseToRupees
} = require("../utils/money");

// Convert a MongoDB transaction document into a safe API response.
const formatTransaction = (transaction) => {
    return {
        id: transaction._id.toString(),
        title: transaction.title,
        amount: paiseToRupees(transaction.amountPaise),
        type: transaction.type,
        category: transaction.category,
        description: transaction.description || "",
        transactionDate: transaction.transactionDate
            .toISOString()
            .slice(0, 10),
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
    };
};


// GET /api/transactions
// Retrieve all transactions belonging to the authenticated user.
const getTransactions = async (req, res) => {
    const filter = {
        userId: req.userId
    };

    const { type } = req.query;

    if (type && type !== "all") {
        filter.type = type;
    }

    const transactions = await Transaction.find(filter)
        .sort({
            transactionDate: -1,
            createdAt: -1
        });

    const formattedTransactions =
        transactions.map(formatTransaction);

    return res.status(200).json({
        status: "success",
        data: {
            transactions: formattedTransactions,
            count: formattedTransactions.length
        }
    });
};


// POST /api/transactions
// Create a new transaction for the authenticated user.
const createTransaction = async (req, res) => {
    const {
        title,
        amount,
        type,
        category,
        description,
        transactionDate
    } = req.body;

    const amountPaise = rupeesToPaise(amount);

    const selectedDate = new Date(
        `${transactionDate}T00:00:00.000Z`
    );

    const transaction = await Transaction.create({
        userId: req.userId,
        title: title.trim(),
        amountPaise,
        type,
        category,
        description: description?.trim() || "",
        transactionDate: selectedDate
    });

    return res.status(201).json({
        status: "success",
        message: "Transaction created successfully.",
        data: {
            transaction: formatTransaction(transaction)
        }
    });
};


// GET /api/transactions/:id
// Retrieve one transaction belonging to the authenticated user.
const getTransactionById = async (req, res) => {
    const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.userId
    });

    if (!transaction) {
        return res.status(404).json({
            status: "error",
            message: "Transaction not found."
        });
    }

    return res.status(200).json({
        status: "success",
        data: {
            transaction: formatTransaction(transaction)
        }
    });
};


// PUT /api/transactions/:id
// Update an existing transaction owned by the authenticated user.
const updateTransaction = async (req, res) => {
    const {
        title,
        amount,
        type,
        category,
        description,
        transactionDate
    } = req.body;

    const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.userId
    });

    if (!transaction) {
        return res.status(404).json({
            status: "error",
            message: "Transaction not found."
        });
    }

    transaction.title = title.trim();
    transaction.amountPaise = rupeesToPaise(amount);
    transaction.type = type;
    transaction.category = category;
    transaction.description = description?.trim() || "";
    transaction.transactionDate = new Date(
        `${transactionDate}T00:00:00.000Z`
    );

    await transaction.save();

    return res.status(200).json({
        status: "success",
        message: "Transaction updated successfully.",
        data: {
            transaction: formatTransaction(transaction)
        }
    });
};


// DELETE /api/transactions/:id
// Delete a transaction owned by the authenticated user.
const deleteTransaction = async (req, res) => {
    const transaction = await Transaction.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
    });

    if (!transaction) {
        return res.status(404).json({
            status: "error",
            message: "Transaction not found."
        });
    }

    return res.status(204).send();
};


module.exports = {
    getTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};