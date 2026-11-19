export const INCOME_CATEGORIES = Object.freeze([
    "Salary",
    "Freelance",
    "Business",
    "Gift",
    "Other"
]);

export const EXPENSE_CATEGORIES = Object.freeze([
    "Food",
    "Groceries",
    "Transport",
    "Shopping",
    "Rent",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Travel",
    "Subscriptions",
    "Other"
]);

export const getCategoriesByType = (type) => {
    return type === "income"
        ? INCOME_CATEGORIES
        : EXPENSE_CATEGORIES;
};