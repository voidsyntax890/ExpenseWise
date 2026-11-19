import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import transactionService from "../services/transactionService";
import TransactionItem from "../components/TransactionItem";
import DeleteConfirmation from "../components/DeleteConfirmation";
import getErrorMessage from "../utils/errorMessage";

const FILTERS = [
    { label: "All", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" }
];

const TransactionsPage = () => {
    const location = useLocation();

    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        () => location.state?.success || ""
    );

    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [reloadKey, setReloadKey] = useState(0);


    // Fetch transactions whenever the filter or reload key changes.
    useEffect(() => {
        let cancelled = false;

        const fetchTransactions = async () => {
            try {
                const result =
                    await transactionService.getTransactions(filter);

                if (!cancelled) {
                    setTransactions(result.transactions);
                }

            } catch (err) {
                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            err,
                            "Unable to load transactions. Please try again."
                        )
                    );
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchTransactions();

        return () => {
            cancelled = true;
        };

    }, [filter, reloadKey]);


    // Change the selected transaction filter.
    const handleFilterChange = (newFilter) => {
        if (newFilter === filter) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        setFilter(newFilter);
    };


    // Retry loading transactions after an API failure.
    const handleRetry = () => {
        setLoading(true);
        setError("");
        setReloadKey((previous) => previous + 1);
    };


    // Open the delete confirmation dialog.
    const handleDeleteClick = (transaction) => {
        setTransactionToDelete(transaction);
        setError("");
        setSuccess("");
    };


    // Cancel deletion.
    const handleCancelDelete = () => {
        if (deleting) {
            return;
        }

        setTransactionToDelete(null);
    };


    // Confirm and delete the selected transaction.
    const handleConfirmDelete = async () => {
        if (!transactionToDelete || deleting) {
            return;
        }

        setDeleting(true);
        setError("");
        setSuccess("");

        try {
            await transactionService.deleteTransaction(
                transactionToDelete.id
            );

            setSuccess(
                `"${transactionToDelete.title}" was deleted successfully.`
            );

            setTransactionToDelete(null);

            // Reload the transaction list after successful deletion.
            setLoading(true);
            setReloadKey((previous) => previous + 1);

        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to delete transaction. Please try again."
                )
            );

        } finally {
            setDeleting(false);
        }
    };


    return (
        <section className="transactions-page">

            {/* Page heading */}
            <div className="transactions-heading">

                <div className="page-heading">
                    <p className="eyebrow">YOUR FINANCES</p>

                    <h1>Transactions</h1>

                    <p>
                        Manage your income and expenses in one place.
                    </p>
                </div>

                <Link
                    to="/transactions/new"
                    className="primary-button add-transaction-button"
                >
                    + Add transaction
                </Link>

            </div>


            {/* Success message */}
            {success && (
                <div
                    className="feedback-message feedback-success"
                    role="status"
                >
                    <span>{success}</span>

                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                        aria-label="Dismiss success message"
                    >
                        ×
                    </button>
                </div>
            )}


            {/* Error message */}
            {error && (
                <div
                    className="feedback-message feedback-error"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={handleRetry}
                        disabled={loading}
                    >
                        Try again
                    </button>
                </div>
            )}


            {/* Transaction filters */}
            <div className="transaction-toolbar">

                <div className="transaction-filters">

                    {FILTERS.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            className={
                                filter === item.value
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() =>
                                handleFilterChange(item.value)
                            }
                            aria-pressed={filter === item.value}
                        >
                            {item.label}
                        </button>
                    ))}

                </div>

                <span className="transaction-count">
                    {transactions.length} transaction(s)
                </span>

            </div>


            {/* Loading state */}
            {loading && (
                <div className="transaction-state">

                    <div className="loader"></div>

                    <p>Loading transactions...</p>

                </div>
            )}


            {/* Empty state */}
            {!loading && !error && transactions.length === 0 && (
                <div className="transaction-empty-state">

                    <div className="empty-state-icon">
                        ₹
                    </div>

                    <h2>No transactions yet</h2>

                    <p>
                        {filter === "all"
                            ? "Start tracking your money by adding your first transaction."
                            : `No ${filter} transactions found.`}
                    </p>

                    {filter === "all" ? (
                        <Link
                            to="/transactions/new"
                            className="primary-button"
                        >
                            Add your first transaction
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => handleFilterChange("all")}
                        >
                            View all transactions
                        </button>
                    )}

                </div>
            )}


            {/* Transaction list */}
            {!loading && !error && transactions.length > 0 && (
                <div className="transaction-list">

                    <div className="transaction-list-header">
                        <span>TRANSACTION</span>
                        <span>DATE</span>
                        <span>TYPE</span>
                        <span>AMOUNT</span>
                        <span>ACTIONS</span>
                    </div>

                    {transactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            onDelete={handleDeleteClick}
                        />
                    ))}

                </div>
            )}


            {/* Delete confirmation dialog */}
            <DeleteConfirmation
                transaction={transactionToDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                deleting={deleting}
            />

        </section>
    );
};

export default TransactionsPage;