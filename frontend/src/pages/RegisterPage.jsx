import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import getErrorMessage from "../utils/errorMessage";

const RegisterPage = () => {
    const { register } = useAuth();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            await register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            navigate("/dashboard", { replace: true });

        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to create your account. Please try again."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <Link to="/register" className="auth-brand">
                    <span className="brand-icon">E</span>
                    <span>ExpenseWise</span>
                </Link>

                <div className="auth-heading">
                    <h1>Create account</h1>
                    <p>Start managing your income and expenses.</p>
                </div>

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="name">Full name</label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            maxLength={80}
                            required
                        />
                    </div>

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
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={72}
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

                        <small className="field-hint">
                            Use at least 8 characters.
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={submitting}
                    >
                        {submitting ? "Creating account..." : "Create account"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Log in</Link>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;