import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import transactionService from "../services/transactionService";
import getErrorMessage from "../utils/errorMessage";


const EMPTY_SUMMARY = {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0
};


const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});


const formatCurrency = (amount) => {
    return currencyFormatter.format(Number(amount) || 0);
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


const DashboardPage = () => {

    const { user } = useAuth();
    const location = useLocation();

    const firstName =
        user?.name?.trim().split(/\s+/)[0] || "there";

    const [summary, setSummary] = useState(EMPTY_SUMMARY);
    const [recentTransactions, setRecentTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);


    // Load financial summary and recent transactions.
    useEffect(() => {

        let cancelled = false;

        const loadDashboard = async () => {

            try {

                const [summaryData, transactionData] =
                    await Promise.all([
                        transactionService.getTransactionSummary(),
                        transactionService.getTransactions("all")
                    ]);

                if (!cancelled) {

                    setSummary(summaryData || EMPTY_SUMMARY);

                    setRecentTransactions(
                        transactionData.transactions.slice(0, 5)
                    );

                    setError("");
                }

            } catch (err) {

                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            err,
                            "Unable to load your dashboard. Please try again."
                        )
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            cancelled = true;
        };

    }, [reloadKey]);


    const handleRetry = () => {
        setLoading(true);
        setError("");
        setReloadKey(previous => previous + 1);
    };


    return (
        <section className="dashboard-page">

            {/* Dashboard heading and actions */}
            <div className="dashboard-header">

                <div className="page-heading">
                    <div>
                        <p className="eyebrow">OVERVIEW</p>

                        <h1>Dashboard</h1>

                        <p>Welcome back, {firstName}.</p>
                    </div>
                </div>


                <div className="dashboard-header-actions">

                    <select
                        className="dashboard-period-selector"
                        value="this-month"
                        disabled
                        aria-label="Summary period"
                    >
                        <option value="this-month">
                            This month
                        </option>
                    </select>


                    <Link
                        to="/transactions/new"
                        state={{ from: location.pathname }}
                        className="dashboard-add-button"
                    >
                        + Add transaction
                    </Link>

                </div>

            </div>


            {/* Error state */}
            {error && !loading && (

                <div className="dashboard-error">

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={handleRetry}
                    >
                        Try again
                    </button>

                </div>

            )}


            {!error && (

                <>

                    {/* Financial summary cards */}
                    <div className="dashboard-summary-grid">

                        <article className="dashboard-summary-card income">

                            <div className="dashboard-card-top">
                                <span>Total Income</span>
                                <span className="dashboard-card-icon">↗</span>
                            </div>

                            <h2>
                                {loading
                                    ? "Loading..."
                                    : formatCurrency(summary.totalIncome)}
                            </h2>

                            <p>Money received this month</p>

                        </article>


                        <article className="dashboard-summary-card expense">

                            <div className="dashboard-card-top">
                                <span>Total Expenses</span>
                                <span className="dashboard-card-icon">↘</span>
                            </div>

                            <h2>
                                {loading
                                    ? "Loading..."
                                    : formatCurrency(summary.totalExpenses)}
                            </h2>

                            <p>Money spent this month</p>

                        </article>


                        <article className="dashboard-summary-card balance">

                            <div className="dashboard-card-top">
                                <span>Net Balance</span>
                                <span className="dashboard-card-icon">₹</span>
                            </div>

                            <h2>
                                {loading
                                    ? "Loading..."
                                    : formatCurrency(summary.netBalance)}
                            </h2>

                            <p>Income minus expenses</p>

                        </article>

                    </div>


                    {/* Recent transactions */}
                    <section className="dashboard-recent-section">

                        <div className="dashboard-section-header">

                            <div>
                                <p className="eyebrow">YOUR ACTIVITY</p>
                                <h2>Recent Transactions</h2>
                            </div>

                            <Link to="/transactions">
                                View all →
                            </Link>

                        </div>


                        {loading ? (

                            <div className="dashboard-state">
                                Loading recent transactions...
                            </div>

                        ) : recentTransactions.length === 0 ? (

                            <div className="dashboard-state dashboard-empty">

                                <div className="dashboard-empty-icon">
                                    ₹
                                </div>

                                <h3>No transactions yet</h3>

                                <p>
                                    Start tracking your finances by adding
                                    your first transaction.
                                </p>

                                <Link
                                    to="/transactions/new"
                                    state={{ from: location.pathname }}
                                    className="dashboard-add-button"
                                >
                                    Add your first transaction
                                </Link>

                            </div>

                        ) : (

                            <div className="dashboard-recent-list">

                                {recentTransactions.map(transaction => (

                                    <article
                                        className="dashboard-recent-item"
                                        key={transaction.id}
                                    >

                                        <div className={`dashboard-recent-icon ${transaction.type}`}>
                                            {transaction.type === "income" ? "↗" : "↙"}
                                        </div>


                                        <div className="dashboard-recent-details">

                                            <h3>{transaction.title}</h3>

                                            <p>
                                                {transaction.category}
                                                <span>•</span>
                                                {formatDate(transaction.transactionDate)}
                                            </p>

                                        </div>


                                        <div className="dashboard-recent-right">

                                            <span className={`dashboard-type-label ${transaction.type}`}>
                                                {transaction.type}
                                            </span>

                                            <strong className={transaction.type}>
                                                {transaction.type === "income" ? "+" : "-"}
                                                {formatCurrency(transaction.amount)}
                                            </strong>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                    </section>

                </>
            )}

        </section>
    );
};

export default DashboardPage;