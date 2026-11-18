const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.use(express.json());

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "ExpenseWise API is running!"
    });
});

const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`ExpenseWise server running on port ${PORT}`);
    });
};

startServer();