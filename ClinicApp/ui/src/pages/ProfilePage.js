import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, Mail, Phone, IdCard, Stethoscope, Hash } from "lucide-react";

const ProfilePage = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const [formData, setFormData] = useState({
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || '',
        phone: currentUser?.phone || '',
        email: currentUser?.email || ''
    });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [doctorData, setDoctorData] = useState({
        specialty: '',
        license_number: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                phone: currentUser.phone || '',
                email: currentUser.email || ''
            });

            if (currentUser.role === 'DOCTOR') {
                api.get('/api/doctors/me/')
                    .then(response => {
                        setDoctorData({
                            specialty: response.data.specialty || '',
                            license_number: response.data.license_number || ''
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching doctor profile:', error);
                    });
            }
        }
    }, [currentUser]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        if (currentUser.role === 'DOCTOR') {
            console.log('Submitting doctor data:', doctorData);
        }
        try {
            // Update user
            const userResponse = await api.patch('/api/users/me/update/', formData);

            // Update doctor's profile only if user is a doctor
            if (currentUser.role === 'DOCTOR') {
                try {
                    await api.patch('/api/doctors/me/update/', doctorData);
                } catch (doctorError) {
                    console.error('Doctor update error:', doctorError);
                }
            }

            // Update user data in context with the response from server
            setCurrentUser(userResponse.data);

            setMessage('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            console.error('Full error object:', err);
            console.error('Error response:', err.response);
            console.error('Error request:', err.request);
            console.error('Full update error:', err);

            let errorMessage = 'Error updating profile';
            if (err.response) {
                errorMessage = err.response.data?.detail ||
                    err.response.data?.message ||
                    JSON.stringify(err.response.data);
            } else if (err.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = err.message || 'Unknown error occurred';
            }

            setMessage(errorMessage);
        }
    };

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full">
                        <User className="w-8 h-8" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        User Profile
                    </h2>
                    <p className="text-gray-600">Manage and keep your information up to date</p>
                    <p className="mt-2 text-sm font-medium text-blue-600">
                        <strong>Role:</strong> {currentUser.role}
                    </p>
                    {currentUser.role === 'DOCTOR' && (
                        <div className="mt-2 text-gray-700">
                            <p><strong>Specialty:</strong> {doctorData.specialty}</p>
                            <p><strong>License Number:</strong> {doctorData.license_number}</p>
                        </div>
                    )}
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div
                        className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes("success")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                        <div className="relative">
                            <IdCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Doctor Fields */}
                    {currentUser.role === "DOCTOR" && isEditing && (
                        <>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="specialty"
                                    placeholder="Specialty"
                                    value={doctorData.specialty}
                                    onChange={(e) =>
                                        setDoctorData({ ...doctorData, specialty: e.target.value })
                                    }
                                    className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="license_number"
                                    placeholder="License Number"
                                    value={doctorData.license_number}
                                    onChange={(e) =>
                                        setDoctorData({
                                            ...doctorData,
                                            license_number: e.target.value,
                                        })
                                    }
                                    className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between pt-4">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-1/3 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleEditClick}
                                className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;