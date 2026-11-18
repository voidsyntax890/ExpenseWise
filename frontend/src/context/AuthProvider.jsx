import { useEffect, useState } from "react";

import AuthContext from "./AuthContext";
import authService from "../services/authService";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            try {
                const currentUser =
                    await authService.getCurrentUser();

                if (active) {
                    setUser(currentUser);
                }
            } catch {
                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        restoreSession();

        return () => {
            active = false;
        };
    }, []);

    const login = async (credentials) => {
        const loggedInUser =
            await authService.login(credentials);

        setUser(loggedInUser);

        return loggedInUser;
    };

    const register = async (userData) => {
        const registeredUser =
            await authService.register(userData);

        setUser(registeredUser);

        return registeredUser;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;