const rupeesToPaise = (amount) => {
    const amountText =
        typeof amount === "number" && Number.isFinite(amount)
            ? String(amount)
            : typeof amount === "string"
                ? amount.trim()
                : "";

    // Accept only positive rupee amounts with up to 2 decimals
    if (!/^\d+(\.\d{1,2})?$/.test(amountText)) {
        throw new Error("Invalid amount. Enter a positive amount with up to 2 decimal places.");
    }

    const [rupees, paise = ""] = amountText.split(".");

    const totalPaise =
        BigInt(rupees) * 100n + BigInt(paise.padEnd(2, "0"));

    if (totalPaise <= 0n || totalPaise > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error("Amount must be greater than zero and within the supported limit.");
    }

    return Number(totalPaise);
};


const paiseToRupees = (amountPaise) => {
    if (!Number.isSafeInteger(amountPaise) || amountPaise < 0) {
        throw new Error("Amount must be a non-negative safe integer in paise.");
    }

    return Number((amountPaise / 100).toFixed(2));
};


module.exports = {
    rupeesToPaise,
    paiseToRupees
};