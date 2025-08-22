import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Clock, PlusCircle, Trash2 } from "lucide-react";

const ManageSchedulePage = () => {
    const { currentUser } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        date: '',
        start_time: '09:00',
        end_time: '10:00'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/schedules/');
            setSchedules(response.data);
        } catch (error) {
            setError('Failed to load schedules');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const dataToSend = {
                date: newSchedule.date,
                start_time: newSchedule.start_time,
                end_time: newSchedule.end_time,
                doctor: currentUser.doctor_profile
            };

            await api.post('/api/schedules/', dataToSend);
            fetchSchedules();
            setNewSchedule({ date: '', start_time: '09:00', end_time: '10:00' });
        } catch (error) {
            const errorMessage = error.response?.data?.detail ||
                Object.values(error.response?.data)[0]?.[0] ||
                'Failed to create schedule';
            setError(errorMessage);
            console.log(error.response?.data);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            await api.delete(`/api/schedules/${id}/`);
            fetchSchedules();
        } catch (error) {
            setError('Failed to delete availability');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <CalendarDays className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900">
                        Manage Your Availability
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Set up your available hours so patients can book appointments
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Two-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Add new availability */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-blue-600" />
                            Add New Availability
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={newSchedule.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={newSchedule.start_time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={newSchedule.end_time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Availability
                            </button>
                        </form>
                    </div>

                    {/* List availability */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Your Availability
                        </h2>
                        {loading ? (
                            <p>Loading schedules...</p>
                        ) : schedules.length > 0 ? (
                            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Time Slot
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {schedules.map((schedule) => (
                                            <tr key={schedule.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDate(schedule.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatTime(schedule.start_time)} -{" "}
                                                    {formatTime(schedule.end_time)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => deleteSchedule(schedule.id)}
                                                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">
                                No availability scheduled yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageSchedulePage;
