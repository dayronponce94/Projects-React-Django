import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { LogIn, UserPlus, LogOut } from 'lucide-react';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">
                                ClinicApp
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {currentUser && currentUser.role === 'PATIENT' && (
                                <>
                                    <Link
                                        to="/doctors"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Find a Doctor
                                    </Link>
                                    <Link
                                        to="/appointments"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        My Appointments
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}
                            {currentUser && currentUser.role === 'DOCTOR' && (
                                <>
                                    <Link
                                        to="/doctor-dashboard"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Appointments
                                    </Link>
                                    <Link
                                        to="/manage-schedule"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Manage Availability
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                </>

                            )}
                            {currentUser && currentUser.role === 'ADMIN' && (
                                <>
                                    <Link
                                        to="/admin-dashboard"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Admin Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="border-transparent text-gray-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {currentUser ? (
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <NotificationBell />
                                </div>
                                <span className="text-gray-700 mr-4">
                                    Hi, {currentUser.first_name} {currentUser.last_name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 bg-white border border-blue-600 text-blue-600 px-3 py-2 rounded-md text-sm hover:bg-blue-50"
                                >
                                    <LogIn size={18} /> Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                                >
                                    <UserPlus size={18} /> Register
                                </Link>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;