import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/appointments/', {
                    params: { date: selectedDate }
                });

                setAppointments(response.data);
            } catch (error) {
                setError('Failed to load appointments');
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedDate]);

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            await api.patch(`/api/appointments/${appointmentId}/`, { status });

            setAppointments(appointments.map(appt =>
                appt.id === appointmentId ? { ...appt, status } : appt
            ));
        } catch (error) {
            setError('Failed to update appointment');
            console.error('Error updating appointment:', error);
        }
    };

    const formatTime = (timeStr) => {
        return timeStr.slice(0, 5);
    };

    const selectedDatePretty = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    Doctor Appointments
                </h1>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">View Appointments for:</label>
                    <div className="relative max-w-xs">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-4 py-2 shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-blue-600" />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading appointments...</p>
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map(appointment => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-900">
                                                <strong>{appointment.patient_name || 'N/A'}</strong>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full 
                                                ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {appointment.status === 'PENDING' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                                        className="text-green-600 hover:text-green-800 transition"
                                                        title="Confirm Appointment"
                                                    >
                                                        <CheckCircle className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                                        className="text-red-600 hover:text-red-800 transition"
                                                        title="Cancel Appointment"
                                                    >
                                                        <XCircle className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">No Appointments Scheduled</h2>
                        <p className="text-gray-600">You have no appointments for {selectedDatePretty}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboardPage;