import { useState } from "react";

import {
    getCategoriesByType
} from "../constants/transactionCategories";

const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const TransactionForm = ({
    initialValues,
    onSubmit,
    onCancel,
    submitting,
    isEditing
}) => {
    const [formData, setFormData] = useState(() => ({
        title: initialValues?.title || "",
        amount: initialValues?.amount !== undefined
            ? String(initialValues.amount)
            : "",
        type: initialValues?.type || "expense",
        category: initialValues?.category || "Food",
        transactionDate: initialValues?.transactionDate || getTodayDate(),
        description: initialValues?.description || ""
    }));

    const [errors, setErrors] = useState({});

    const categories = getCategoriesByType(formData.type);


    // Update form fields.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };


    // Change transaction type and reset category if necessary.
    const handleTypeChange = (type) => {
        const availableCategories = getCategoriesByType(type);

        setFormData((previous) => ({
            ...previous,
            type,
            category: availableCategories.includes(previous.category)
                ? previous.category
                : availableCategories[0]
        }));

        setErrors((previous) => ({
            ...previous,
            type: "",
            category: ""
        }));
    };


    // Validate all fields before submitting.
    const validateForm = () => {
        const newErrors = {};

        const trimmedTitle = formData.title.trim();
        const trimmedAmount = formData.amount.trim();
        const trimmedDescription = formData.description.trim();

        if (!trimmedTitle) {
            newErrors.title = "Transaction title is required.";
        } else if (trimmedTitle.length > 120) {
            newErrors.title = "Title cannot exceed 120 characters.";
        }

        if (
            !/^\d+(\.\d{1,2})?$/.test(trimmedAmount) ||
            !Number.isFinite(Number(trimmedAmount)) ||
            Number(trimmedAmount) <= 0
        ) {
            newErrors.amount =
                "Enter a positive amount with up to 2 decimal places.";
        }

        if (!["income", "expense"].includes(formData.type)) {
            newErrors.type = "Please select a valid transaction type.";
        }

        if (!categories.includes(formData.category)) {
            newErrors.category = "Please select a valid category.";
        }

        if (!formData.transactionDate) {
            newErrors.transactionDate = "Transaction date is required.";
        } else {
            const date = new Date(
                `${formData.transactionDate}T00:00:00.000Z`
            );

            if (
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== formData.transactionDate
            ) {
                newErrors.transactionDate = "Please enter a valid date.";
            }
        }

        if (trimmedDescription.length > 500) {
            newErrors.description =
                "Description cannot exceed 500 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // Submit validated data to the parent page.
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSubmit({
            title: formData.title.trim(),
            amount: formData.amount.trim(),
            type: formData.type,
            category: formData.category,
            transactionDate: formData.transactionDate,
            description: formData.description.trim()
        });
    };


    return (
        <form
            className="transaction-form"
            onSubmit={handleSubmit}
            noValidate
        >

            {/* Transaction title */}
            <div className="form-group">
                <label htmlFor="transaction-title">
                    Transaction title *
                </label>

                <input
                    id="transaction-title"
                    name="title"
                    type="text"
                    placeholder="e.g. Grocery Shopping"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={120}
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(errors.title)}
                />

                {errors.title && (
                    <small className="form-field-error">
                        {errors.title}
                    </small>
                )}
            </div>


            {/* Amount */}
            <div className="form-group">
                <label htmlFor="transaction-amount">
                    Amount (₹) *
                </label>

                <input
                    id="transaction-amount"
                    name="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 1250.50"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(errors.amount)}
                />

                {errors.amount && (
                    <small className="form-field-error">
                        {errors.amount}
                    </small>
                )}
            </div>


            {/* Transaction type */}
            <fieldset className="form-group type-fieldset">
                <legend>Transaction type *</legend>

                <div className="type-selector">

                    <button
                        type="button"
                        className={
                            formData.type === "income"
                                ? "type-option income selected"
                                : "type-option income"
                        }
                        onClick={() => handleTypeChange("income")}
                        disabled={submitting}
                        aria-pressed={formData.type === "income"}
                    >
                        <span>＋</span>
                        Income
                    </button>

                    <button
                        type="button"
                        className={
                            formData.type === "expense"
                                ? "type-option expense selected"
                                : "type-option expense"
                        }
                        onClick={() => handleTypeChange("expense")}
                        disabled={submitting}
                        aria-pressed={formData.type === "expense"}
                    >
                        <span>−</span>
                        Expense
                    </button>

                </div>

                {errors.type && (
                    <small className="form-field-error">
                        {errors.type}
                    </small>
                )}
            </fieldset>


            {/* Category */}
            <div className="form-group">
                <label htmlFor="transaction-category">
                    Category *
                </label>

                <select
                    id="transaction-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={submitting}
                    aria-invalid={Boolean(errors.category)}
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {errors.category && (
                    <small className="form-field-error">
                        {errors.category}
                    </small>
                )}
            </div>


            {/* Transaction date */}
            <div className="form-group">
                <label htmlFor="transaction-date">
                    Transaction date *
                </label>

                <input
                    id="transaction-date"
                    name="transactionDate"
                    type="date"
                    value={formData.transactionDate}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(errors.transactionDate)}
                />

                {errors.transactionDate && (
                    <small className="form-field-error">
                        {errors.transactionDate}
                    </small>
                )}
            </div>


            {/* Description */}
            <div className="form-group">
                <label htmlFor="transaction-description">
                    Description (Optional)
                </label>

                <textarea
                    id="transaction-description"
                    name="description"
                    placeholder="Add some additional details..."
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={500}
                    rows={4}
                    disabled={submitting}
                    aria-invalid={Boolean(errors.description)}
                />

                {errors.description && (
                    <small className="form-field-error">
                        {errors.description}
                    </small>
                )}

                <small className="field-hint">
                    {formData.description.length}/500 characters
                </small>
            </div>


            {/* Form actions */}
            <div className="transaction-form-actions">

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="primary-button"
                    disabled={submitting}
                >
                    {submitting
                        ? "Saving..."
                        : isEditing
                            ? "Save changes"
                            : "Save transaction"}
                </button>

            </div>

        </form>
    );
};

export default TransactionForm;