import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash2 } from 'lucide-react';

const AdminDashboardPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('doctors');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (activeTab === 'doctors') {
                    const response = await api.get('/api/doctors/by-specialty/');
                    setDoctors(response.data);
                } else {
                    const response = await api.get('/api/appointments/');
                    setAppointments(response.data);
                }
            } catch (error) {
                setError(`Failed to load ${activeTab}`);
                console.error(`Error fetching ${activeTab}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        specialty: '',
        license_number: ''
    });

    const createDoctor = async () => {
        try {
            const response = await api.post('/api/users/register/doctor/', newDoctor);
            console.log('Doctor created successfully:', response.data);

            const doctorsResponse = await api.get('/api/doctors/by-specialty/');
            setDoctors(doctorsResponse.data);

            setShowAddDoctor(false);
            setNewDoctor({
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                phone: '',
                specialty: '',
                license_number: ''
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create doctor');
        }
    };

    const deleteDoctor = async (doctorId) => {
        try {
            await api.delete(`/api/doctors/${doctorId}/`);
            setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        } catch (error) {
            setError('Failed to delete doctor');
            console.error('Error deleting doctor:', error);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        const day = date.getUTCDate();
        return `${month} ${day}, ${year}`;
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.slice(0, 5);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex justify-center space-x-8">
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`py-3 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === 'doctors'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Manage Doctors
                        </button>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`py-3 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === 'appointments'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            View All Appointments
                        </button>
                    </nav>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading data...</p>
                    </div>
                ) : activeTab === 'doctors' ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Doctors</h2>
                            <button
                                onClick={() => setShowAddDoctor(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                            >
                                Add New Doctor
                            </button>
                        </div>

                        {/* Modal para añadir doctor */}
                        {showAddDoctor && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                    <h3 className="text-xl font-bold mb-4">Add New Doctor</h3>
                                    <div className="space-y-4">
                                        <input type="email" placeholder="Email" className="w-full p-2 border rounded"
                                            value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                                        <input type="password" placeholder="Password" className="w-full p-2 border rounded"
                                            value={newDoctor.password} onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="First Name" className="p-2 border rounded"
                                                value={newDoctor.first_name} onChange={e => setNewDoctor({ ...newDoctor, first_name: e.target.value })} />
                                            <input type="text" placeholder="Last Name" className="p-2 border rounded"
                                                value={newDoctor.last_name} onChange={e => setNewDoctor({ ...newDoctor, last_name: e.target.value })} />
                                        </div>
                                        <input type="text" placeholder="Phone" className="w-full p-2 border rounded"
                                            value={newDoctor.phone} onChange={e => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
                                        <input type="text" placeholder="Specialty" className="w-full p-2 border rounded"
                                            value={newDoctor.specialty} onChange={e => setNewDoctor({ ...newDoctor, specialty: e.target.value })} />
                                        <input type="text" placeholder="License Number" className="w-full p-2 border rounded"
                                            value={newDoctor.license_number} onChange={e => setNewDoctor({ ...newDoctor, license_number: e.target.value })} />
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button onClick={() => setShowAddDoctor(false)}
                                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                        <button onClick={createDoctor}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Doctor</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabla de doctores */}
                        {doctors.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {doctors.map(doctor => (
                                            <tr key={doctor.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        Dr. {doctor.user?.first_name || 'N/A'} {doctor.user?.last_name || ''}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{doctor.user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.license_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => deleteDoctor(doctor.id)}
                                                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <h2 className="text-xl font-semibold mb-2">No Doctors Found</h2>
                                <p className="text-gray-600">You haven't added any doctors yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Appointments</h2>
                        {appointments.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {appointments.map(appointment => (
                                            <tr key={appointment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">Dr. {appointment.doctor_name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{appointment.schedule.doctor.specialty}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{appointment.patient_name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{appointment.patient.user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatDate(appointment.schedule.date)}</div>
                                                    <div className="text-sm text-gray-500">{formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'CONFIRMED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : appointment.status === 'CANCELLED'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <h2 className="text-xl font-semibold mb-2">No Appointments Found</h2>
                                <p className="text-gray-600">There are no appointments scheduled yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;