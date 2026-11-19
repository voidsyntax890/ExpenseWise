import { Link } from "react-router-dom";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};

const TransactionItem = ({ transaction, onDelete }) => {
    const isIncome = transaction.type === "income";

    return (
        <article className="transaction-item">

            <div className="transaction-main">
                <div className={`transaction-type-icon ${transaction.type}`}>
                    {isIncome ? "+" : "−"}
                </div>

                <div className="transaction-details">
                    <strong>{transaction.title}</strong>
                    <span>{transaction.category}</span>
                </div>
            </div>

            <div className="transaction-date">
                {formatDate(transaction.transactionDate)}
            </div>

            <div>
                <span className={`transaction-badge ${transaction.type}`}>
                    {isIncome ? "Income" : "Expense"}
                </span>
            </div>

            <div className={`transaction-amount ${transaction.type}`}>
                {isIncome ? "+" : "−"}{formatCurrency(transaction.amount)}
            </div>

            <div className="transaction-actions">
                <Link
                    to={`/transactions/${transaction.id}/edit`}
                    className="edit-action"
                    aria-label={`Edit ${transaction.title}`}
                >
                    Edit
                </Link>

                <button
                    type="button"
                    className="delete-action"
                    onClick={() => onDelete(transaction)}
                    aria-label={`Delete ${transaction.title}`}
                >
                    Delete
                </button>
            </div>

        </article>
    );
};

export default TransactionItem;