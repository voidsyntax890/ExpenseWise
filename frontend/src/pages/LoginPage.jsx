import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import getErrorMessage from "../utils/errorMessage";

const LoginPage = () => {
    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login({
                email: email.trim().toLowerCase(),
                password
            });

            const destination =
                location.state?.from?.pathname || "/dashboard";

            navigate(destination, { replace: true });

        } catch (err) {
            setError(
                getErrorMessage(err, "Unable to log in. Please try again.")
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <Link to="/login" className="auth-brand">
                    <span className="brand-icon">E</span>
                    <span>ExpenseWise</span>
                </Link>

                <div className="auth-heading">
                    <h1>Welcome back</h1>
                    <p>Log in to manage your money smarter.</p>
                </div>

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">Email address</label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-pressed={showPassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={submitting}
                    >
                        {submitting ? "Logging in..." : "Log in"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Create an account</Link>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;