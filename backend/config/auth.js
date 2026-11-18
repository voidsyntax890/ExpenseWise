const AUTH_COOKIE_NAME = "expensewise_token";

const JWT_EXPIRES_IN = "1d";

const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        const error = new Error(
            "JWT_SECRET must contain at least 32 characters."
        );

        error.statusCode = 500;
        throw error;
    }

    return secret;
};

const getAuthCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/"
});

const getClearCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
});

module.exports = {
    AUTH_COOKIE_NAME,
    JWT_EXPIRES_IN,
    getJwtSecret,
    getAuthCookieOptions,
    getClearCookieOptions
};