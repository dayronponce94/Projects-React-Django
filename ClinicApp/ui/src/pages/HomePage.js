import React from 'react';
import { Calendar, Stethoscope, Users, ClipboardList, BarChart3 } from "lucide-react";
import { useAuth } from '../context/AuthContext';


const HomePage = () => {
    const { currentUser } = useAuth();


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
            <main className="flex-1 max-w-7xl mx-auto px-6 py-10">
                {/* VISTA PARA INVITADO */}
                {!currentUser && (
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to ClinicApp</h2>
                        <p className="text-lg text-gray-600 mb-8">Manage your medical appointments online easily.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
                                <Calendar className="text-blue-600 mb-4" size={40} />
                                <h3 className="font-semibold text-gray-700">Book Appointments</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
                                <Stethoscope className="text-blue-600 mb-4" size={40} />
                                <h3 className="font-semibold text-gray-700">Consult Doctors</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
                                <Users className="text-blue-600 mb-4" size={40} />
                                <h3 className="font-semibold text-gray-700">Manage Your Health</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* VISTA PARA PACIENTE */}
                {currentUser && currentUser.role === "PATIENT" && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <Calendar className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">My Appointments</h3>
                                    <p className="text-sm text-gray-500">View and manage your bookings</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <ClipboardList className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">Book New</h3>
                                    <p className="text-sm text-gray-500">Find a doctor and schedule</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <Users className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">My Doctors</h3>
                                    <p className="text-sm text-gray-500">See who you’ve visited</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VISTA PARA DOCTOR */}
                {currentUser && currentUser.role === "DOCTOR" && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <Calendar className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">My Schedule</h3>
                                    <p className="text-sm text-gray-500">Manage your availability</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <Users className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">My Patients</h3>
                                    <p className="text-sm text-gray-500">See who you’re treating</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <ClipboardList className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">Upcoming Appointments</h3>
                                    <p className="text-sm text-gray-500">Check your next consultations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VISTA PARA ADMIN */}
                {currentUser && currentUser.role === "ADMIN" && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <Users className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">Manage Users</h3>
                                    <p className="text-sm text-gray-500">Add, edit or remove users</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <Calendar className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">Appointments</h3>
                                    <p className="text-sm text-gray-500">See all system bookings</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
                                <BarChart3 className="text-blue-600" size={36} />
                                <div>
                                    <h3 className="font-semibold">Analytics</h3>
                                    <p className="text-sm text-gray-500">Track system performance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;