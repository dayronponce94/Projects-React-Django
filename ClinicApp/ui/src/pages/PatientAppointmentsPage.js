import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import api from '../api';

const PatientAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/api/appointments/');
                setAppointments(response.data);
            } catch (error) {
                setError('Failed to load appointments');
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const cancelAppointment = async (appointmentId) => {
        try {
            await api.patch(`/api/appointments/${appointmentId}/`, { status: 'CANCELLED' });

            setAppointments(appointments.map(appt =>
                appt.id === appointmentId ? { ...appt, status: 'CANCELLED' } : appt
            ));
        } catch (error) {
            setError('Failed to cancel appointment');
            console.error('Error cancelling appointment:', error);
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

    const getStatusBadge = (status) => {
        const statusClasses = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-5xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">My Appointments</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p>Loading appointments...</p>
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doctor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                Dr. {appointment.doctor_name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {appointment.schedule?.doctor?.specialty || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {appointment.schedule?.date
                                                    ? formatDate(appointment.schedule.date)
                                                    : 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatTime(appointment.schedule?.start_time)} - {formatTime(appointment.schedule?.end_time)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(appointment.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {appointment.status === 'PENDING' && (
                                                <button
                                                    onClick={() => cancelAppointment(appointment.id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2">No Appointments Scheduled</h2>
                        <p className="text-gray-600 mb-4">
                            You haven't booked any appointments yet.
                        </p>
                        <a
                            href="/doctors"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                        >
                            Find a Doctor
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientAppointmentsPage;