import { NavLink, Outlet, useNavigate } from "react-router-dom";
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

            <aside className="sidebar">

                <div className="sidebar-brand">
                    <span className="brand-icon">E</span>
                    <span>ExpenseWise</span>
                </div>

                <div className="sidebar-section-label">
                    WORKSPACE
                </div>

                <nav className="sidebar-nav">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span>▤</span>
                        Transactions
                    </NavLink>

                </nav>

                <div className="sidebar-bottom">
                    <p>Personal finance, simplified.</p>
                </div>

            </aside>

            <div className="app-main">

                <header className="app-topbar">

                    <div className="topbar-brand">
                        <span className="brand-icon">E</span>
                        ExpenseWise
                    </div>

                    <div className="account-details">

                        <div className="account-avatar">
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
                        >
                            Sign out
                        </button>

                    </div>

                </header>

                <main className="page-container">
                    <Outlet />
                </main>

                <nav className="mobile-bottom-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "mobile-nav-active" : ""
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            isActive ? "mobile-nav-active" : ""
                        }
                    >
                        <span>▤</span>
                        Transactions
                    </NavLink>
                </nav>

            </div>

        </div>
    );
};

export default AppLayout;