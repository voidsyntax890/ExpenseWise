import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading ExpenseWise...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;