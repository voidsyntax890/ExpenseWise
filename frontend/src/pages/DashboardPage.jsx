import { useAuth } from "../context/useAuth";

const DashboardPage = () => {
    const { user } = useAuth();

    const firstName =
        user?.name?.trim().split(/\s+/)[0] || "there";

    return (
        <section className="dashboard-page">

            <div className="page-heading">
                <div>
                    <p className="eyebrow">OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <p>Welcome back, {firstName}.</p>
                </div>
            </div>

            <div className="welcome-panel">

                <div className="welcome-icon">₹</div>

                <div>
                    <h2>Your ExpenseWise workspace is ready!</h2>

                    <p>
                        Your personal finance dashboard is set up.
                        Your income, expenses, balance and recent
                        transactions will appear here as we build
                        the remaining features.
                    </p>

                    <span className="status-badge">
                        Account successfully connected
                    </span>
                </div>

            </div>

        </section>
    );
};

export default DashboardPage;