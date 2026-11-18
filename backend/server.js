const express = require("express");
require("dotenv").config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "ExpenseWise API is running!"
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`ExpenseWise server running on port ${PORT}`);
});