import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase, Badge, UserPlus } from 'lucide-react';
import api from '../api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'PATIENT',
        specialty: '',
        license_number: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
            setError("Please fill all required fields.");
            return;
        }

        if (formData.role === "DOCTOR" && (!formData.specialty || !formData.license_number)) {
            setError("Doctors must provide specialty and license number.");
            return;
        }

        try {
            const endpoint = formData.role === 'DOCTOR'
                ? '/api/users/register/doctor/'
                : '/api/users/register/patient/';

            const payload = formData.role === 'DOCTOR'
                ? {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    specialty: formData.specialty,
                    license_number: formData.license_number
                }
                : {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone
                };

            await api.post(endpoint, payload);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                    <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Create Your Account
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Join us and take control of your health today
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        Registration successful! Redirecting...
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name */}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <User className="text-gray-400 mr-2" size={18} />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="w-full focus:outline-none"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <User className="text-gray-400 mr-2" size={18} />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="w-full focus:outline-none"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Mail className="text-gray-400 mr-2" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Phone className="text-gray-400 mr-2" size={18} />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone (optional)"
                            className="w-full focus:outline-none"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Lock className="text-gray-400 mr-2" size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full focus:outline-none"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Role */}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Briefcase className="text-gray-400 mr-2" size={18} />
                        <select
                            name="role"
                            className="w-full focus:outline-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>

                    {/* Campos adicionales para DOCTOR */}
                    {formData.role === 'DOCTOR' && (
                        <>
                            <div className="flex items-center border rounded-lg px-3 py-2">
                                <Briefcase className="text-gray-400 mr-2" size={18} />
                                <input
                                    type="text"
                                    name="specialty"
                                    placeholder="Specialty"
                                    className="w-full focus:outline-none"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center border rounded-lg px-3 py-2">
                                <Badge className="text-gray-400 mr-2" size={18} />
                                <input
                                    type="text"
                                    name="license_number"
                                    placeholder="License Number"
                                    className="w-full focus:outline-none"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Register
                    </button>

                    {/* Enlace */}
                    <div className="text-center text-sm mt-2">
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
