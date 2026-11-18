const jwt = require("jsonwebtoken");

const {
    AUTH_COOKIE_NAME,
    getJwtSecret
} = require("../config/auth");

const protect = (req, res, next) => {
    try {
        const token = req.cookies?.[AUTH_COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required."
            });
        }

        const decoded = jwt.verify(token, getJwtSecret());

        if (!decoded.userId) {
            return res.status(401).json({
                status: "error",
                message: "Invalid authentication token."
            });
        }

        req.userId = decoded.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired authentication session."
        });
    }
};

module.exports = protect;