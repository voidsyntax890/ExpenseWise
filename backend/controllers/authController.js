const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
    AUTH_COOKIE_NAME,
    JWT_EXPIRES_IN,
    getJwtSecret,
    getAuthCookieOptions,
    getClearCookieOptions
} = require("../config/auth");

const createToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
        getJwtSecret(),
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});

// REGISTER
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        getJwtSecret();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            passwordHash
        });

        const token = createToken(user._id);

        res.cookie(
            AUTH_COOKIE_NAME,
            token,
            getAuthCookieOptions()
        );

        return res.status(201).json({
            status: "success",
            message: "Account created successfully.",
            data: {
                user: formatUser(user)
            }
        });

    } catch (error) {
        next(error);
    }
};

// LOGIN
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        getJwtSecret();

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password."
            });
        }

        const token = createToken(user._id);

        res.cookie(
            AUTH_COOKIE_NAME,
            token,
            getAuthCookieOptions()
        );

        return res.status(200).json({
            status: "success",
            message: "Login successful.",
            data: {
                user: formatUser(user)
            }
        });

    } catch (error) {
        next(error);
    }
};

// LOGOUT
const logout = (req, res) => {
    res.clearCookie(
        AUTH_COOKIE_NAME,
        getClearCookieOptions()
    );

    return res.status(200).json({
        status: "success",
        message: "Logged out successfully."
    });
};

// GET CURRENT USER
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
            .select("_id name email createdAt");

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User account no longer exists."
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                user: formatUser(user)
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe
};