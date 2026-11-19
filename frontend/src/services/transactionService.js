import api from "./api";

// Retrieve transactions with an optional type filter.
const getTransactions = async (type = "all") => {
    const response = await api.get("/transactions", {
        params: { type }
    });

    const data = response.data?.data;

    return {
        transactions: data?.transactions || [],
        count: data?.count || 0
    };
};


// Retrieve one transaction by ID.
const getTransactionById = async (id) => {
    const response = await api.get(`/transactions/${id}`);

    return response.data?.data?.transaction;
};


// Create a new transaction.
const createTransaction = async (transactionData) => {
    const response = await api.post(
        "/transactions",
        transactionData
    );

    return response.data?.data?.transaction;
};


// Update an existing transaction.
const updateTransaction = async (id, transactionData) => {
    const response = await api.put(
        `/transactions/${id}`,
        transactionData
    );

    return response.data?.data?.transaction;
};


// Delete an existing transaction.
const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
};


const transactionService = {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};

export default transactionService;