import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            // Role-based redirection
            if (userData.role === 'ADMIN') {
                navigate('/');
            } else if (userData.role === 'DOCTOR') {
                navigate('/');
            } else {
                navigate('/');
            }
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                        <LogIn className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        Sign in to ClinicApp
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your appointments with ease
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email address"
                            className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Register link */}
                    <div className="flex items-center justify-center text-sm">
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Don’t have an account? Register
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;