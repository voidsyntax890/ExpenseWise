import api from "./api";

const extractUser = (response) => {
    const payload = response?.data;

    const user =
        payload?.user ??
        payload?.data?.user ??
        payload?.data ??
        payload;

    if (
        !user ||
        typeof user !== "object" ||
        !(user.email || user.id || user._id)
    ) {
        throw new Error("Unable to retrieve user information from the server.");
    }

    return {
        id: user.id ?? user._id,
        name: user.name ?? "",
        email: user.email
    };
};

const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return extractUser(response);
};

const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return extractUser(response);
};

const logout = async () => {
    await api.post("/auth/logout");
};

const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return extractUser(response);
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default authService;