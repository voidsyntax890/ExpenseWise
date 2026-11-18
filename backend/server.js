const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const checkRequestOrigin = require("./middleware/originMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Security headers
app.use(helmet());

// Request parsing
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Origin validation
app.use(checkRequestOrigin);

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "ExpenseWise API is running!"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Not found handler
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "API route not found."
    });
});

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`ExpenseWise server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.name);
    process.exit(1);
});