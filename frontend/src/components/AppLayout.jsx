import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AppLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    const initial = user?.name?.trim()?.charAt(0).toUpperCase() || "U";

    return (
        <div className="app-shell">

            {/* Desktop sidebar */}
            <aside className="sidebar">

                <div className="sidebar-brand">
                    <span className="brand-icon">E</span>
                    <span>ExpenseWise</span>
                </div>

                <div className="sidebar-section-label">
                    WORKSPACE
                </div>

                <nav className="sidebar-nav" aria-label="Main navigation">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon" aria-hidden="true">D</span>
                        <span className="nav-label">Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon" aria-hidden="true">T</span>
                        <span className="nav-label">Transactions</span>
                    </NavLink>

                </nav>

                <div className="sidebar-bottom">
                    <p>Personal finance, simplified.</p>
                </div>

            </aside>


            {/* Main application area */}
            <div className="app-main">

                <header className="app-topbar">

                    <div className="topbar-brand">
                        <span className="brand-icon">E</span>
                        ExpenseWise
                    </div>

                    <div className="account-details">

                        <div className="account-avatar" aria-hidden="true">
                            {initial}
                        </div>

                        <div className="account-text">
                            <strong>{user?.name}</strong>
                            <span>{user?.email}</span>
                        </div>

                        <button
                            type="button"
                            className="signout-button"
                            onClick={handleLogout}
                            aria-label="Sign out of ExpenseWise"
                        >
                            Sign out
                        </button>

                    </div>

                </header>


                <main className="page-container">
                    <Outlet />
                </main>


                {/* Mobile bottom navigation */}
                <nav
                    className="mobile-bottom-nav"
                    aria-label="Mobile navigation"
                >

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `mobile-nav-link ${isActive ? "mobile-nav-active" : ""}`
                        }
                    >
                        <span aria-hidden="true">D</span>
                        Dashboard
                    </NavLink>


                    <Link
                        to="/transactions/new"
                        className="mobile-nav-add"
                        aria-label="Add a new transaction"
                    >
                        <span aria-hidden="true">+</span>
                        Add
                    </Link>


                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            `mobile-nav-link ${isActive ? "mobile-nav-active" : ""}`
                        }
                    >
                        <span aria-hidden="true">T</span>
                        Transactions
                    </NavLink>

                </nav>

            </div>

        </div>
    );
};

export default AppLayout;