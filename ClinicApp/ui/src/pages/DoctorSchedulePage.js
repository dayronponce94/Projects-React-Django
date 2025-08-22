import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const DoctorSchedulePage = () => {
    const { currentUser } = useAuth();
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await api.get(`/api/doctors/${doctorId}/`);
                setDoctor(response.data);
            } catch (error) {
                console.error('Error fetching doctor:', error);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!doctorId) return;

            setLoading(true);
            setError('');
            try {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const response = await api.get(`/api/doctors/availability/${doctorId}/`, {
                    params: { date: dateStr }
                });
                setSlots(response.data);
            } catch (error) {
                setError('Failed to load availability');
                console.error('Error fetching availability:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [doctorId, selectedDate]);

    const bookAppointment = async (slotId) => {
        if (!currentUser || currentUser.role !== 'PATIENT') {
            setError('Only patients can book appointments');
            return;
        }

        try {
            await api.post('/api/appointments/create/', {
                schedule: slotId
            });
            navigate('/appointments');
        } catch (error) {
            console.error('Booking error:', error.response?.data);
            setError(error.response?.data?.detail || 'Failed to book appointment');
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


    if (!doctor) {
        return <div className="container mx-auto px-4 py-8">Loading doctor information...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Dr. {doctor.user.first_name} {doctor.user.last_name}
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Specialty: <span className="font-medium">{doctor.specialty}</span>
                </p>

                <div className="flex items-center justify-center mb-6">
                    <Calendar className="text-blue-600 mr-2" />
                    <label className="mr-4 font-medium">Select Date:</label>
                    <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        min={new Date().toISOString().split('T')[0]}
                        className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && (
                    <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <AlertCircle className="mr-2" size={20} />
                        {error}
                    </div>
                )}

                <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    Available Time Slots
                </h2>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-blue-600">Loading availability...</p>
                    </div>
                ) : slots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {slots.map((slot) => (
                            <div
                                key={slot.id}
                                className="bg-white rounded-lg shadow-md border p-5 flex flex-col items-center"
                            >
                                <div className="flex items-center mb-2 text-gray-700">
                                    <Calendar className="mr-2 text-blue-600" size={18} />
                                    <span>{formatDate(slot.date)}</span>
                                </div>
                                <div className="flex items-center mb-4 text-gray-700">
                                    <Clock className="mr-2 text-blue-600" size={18} />
                                    <span>
                                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => bookAppointment(slot.id)}
                                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                                >
                                    <CheckCircle2 className="mr-2" size={18} /> Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        <AlertCircle className="mr-2" size={20} />
                        No available time slots for the selected date
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorSchedulePage;