import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify session on load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/api/users/me/');
                    const user = response.data;

                    // Get doctor profile
                    if (user.role === 'DOCTOR') {
                        try {
                            const doctorResponse = await api.get('/api/doctors/me/');
                            user.doctor_profile = doctorResponse.data.id;
                        } catch (doctorError) {
                            console.warn('Doctor profile not found');
                        }
                    }

                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                // Clear invalid tokens
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const response = await api.post('/api/token/', { email, password });
            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Setting tokens in headers
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            const userResponse = await api.get('/api/users/me/');
            setCurrentUser(userResponse.data);

            return userResponse.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
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