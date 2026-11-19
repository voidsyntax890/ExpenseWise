import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import TransactionForm from "../components/TransactionForm";
import transactionService from "../services/transactionService";
import getErrorMessage from "../utils/errorMessage";

const TransactionFormPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const isEditing = Boolean(id);

    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const returnTo =
        typeof location.state?.from === "string" &&
        location.state.from.startsWith("/") &&
        !location.state.from.startsWith("//")
            ? location.state.from
            : "/transactions";


    // Load an existing transaction in edit mode.
    useEffect(() => {
        if (!isEditing) {
            return undefined;
        }

        let cancelled = false;

        const loadTransaction = async () => {
            try {
                const transaction =
                    await transactionService.getTransactionById(id);

                if (!cancelled) {
                    setInitialValues(transaction);
                }

            } catch (err) {
                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            err,
                            "Unable to load this transaction."
                        )
                    );
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadTransaction();

        return () => {
            cancelled = true;
        };

    }, [id, isEditing]);


    // Handle creation and updating using the same form.
    const handleSubmit = async (formData) => {
        setSubmitting(true);
        setError("");

        try {
            if (isEditing) {
                await transactionService.updateTransaction(id, formData);

                navigate(returnTo, {
                    replace: true,
                    state: {
                        success: "Transaction updated successfully."
                    }
                });

            } else {
                await transactionService.createTransaction(formData);

                navigate(returnTo, {
                    replace: true,
                    state: {
                        success: "Transaction created successfully."
                    }
                });
            }

        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to save the transaction. Please try again."
                )
            );

        } finally {
            setSubmitting(false);
        }
    };


    const handleCancel = () => {
        navigate(returnTo);
    };


    // Loading state for edit mode.
    if (loading) {
        return (
            <div className="transaction-state">
                <div className="loader"></div>
                <p>Loading transaction details...</p>
            </div>
        );
    }


    // Error state when an existing transaction cannot be retrieved.
    if (isEditing && error && !initialValues) {
        return (
            <section className="transaction-form-page">

                <div className="feedback-message feedback-error">
                    {error}
                </div>

                <Link
                    to="/transactions"
                    className="secondary-button"
                >
                    Back to transactions
                </Link>

            </section>
        );
    }


    return (
        <section className="transaction-form-page">

            <div className="page-heading">
                <p className="eyebrow">YOUR FINANCES</p>

                <h1>
                    {isEditing
                        ? "Edit transaction"
                        : "Add transaction"}
                </h1>

                <p>
                    {isEditing
                        ? "Update the details of your transaction."
                        : "Record your income or expense."}
                </p>
            </div>


            {error && (
                <div className="feedback-message feedback-error" role="alert">
                    {error}
                </div>
            )}


            <div className="transaction-form-card">

                <TransactionForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitting={submitting}
                    isEditing={isEditing}
                />

            </div>

        </section>
    );
};

export default TransactionFormPage;