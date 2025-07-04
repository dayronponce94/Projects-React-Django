import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userEmail = localStorage.getItem('user_email');

        if (token && userEmail) {
            setCurrentUser({
                token,
                email: userEmail
            });
        }

        setLoading(false);
    }, []);

    const login = (token, email) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_email', email);
        setCurrentUser({ token, email });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}