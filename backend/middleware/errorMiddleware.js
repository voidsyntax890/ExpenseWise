const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.code === 11000) {
        return res.status(409).json({
            status: "error",
            message: "An account with this email already exists."
        });
    }

    if (
        err.name === "ValidationError" ||
        err.name === "CastError"
    ) {
        return res.status(400).json({
            status: "error",
            message: "Invalid request data."
        });
    }

    const statusCode = err.statusCode || 500;

    if (statusCode >= 500) {

        if (process.env.NODE_ENV === "production") {
            console.error(
                "Server error:",
                err.name || "UnknownError"
            );
        } else {
            console.error(
                "Server error details:",
                err.stack || err
            );
        }
    }

    return res.status(statusCode).json({
        status: "error",
        message: statusCode >= 500
            ? "An unexpected server error occurred."
            : err.message
    });
};

module.exports = errorHandler;