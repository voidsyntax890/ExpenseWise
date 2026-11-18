const STATE_CHANGING_METHODS = new Set([
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
]);

const checkRequestOrigin = (req, res, next) => {
    if (!STATE_CHANGING_METHODS.has(req.method)) {
        return next();
    }

    const origin = req.get("Origin");

    // Allow non-browser API clients such as Postman.
    if (!origin) {
        return next();
    }

    const allowedOrigin = process.env.CLIENT_URL;

    if (!allowedOrigin || origin !== allowedOrigin) {
        return res.status(403).json({
            status: "error",
            message: "Request origin is not allowed."
        });
    }

    next();
};

module.exports = checkRequestOrigin;