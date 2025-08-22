import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, Stethoscope, FileText } from 'lucide-react';

const DoctorSearchPage = () => {
    const [specialty, setSpecialty] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchDoctors = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/doctors/by-specialty/', {
                params: { specialty }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error searching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Stethoscope className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Find a Doctor</h1>
                    <p className="text-gray-600 mt-2">Search doctors by specialty and check their availability</p>
                </div>

                {/* Search bar */}
                <div className="flex items-center mb-8">
                    <input
                        type="text"
                        placeholder="Search by specialty (e.g. Cardiology)"
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                    />
                    <button
                        onClick={searchDoctors}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-r-xl hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <Search className="h-5 w-5" />
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Results */}
                {doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Dr. {doctor.user.first_name} {doctor.user.last_name}
                                </h2>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-medium">Specialty:</span> {doctor.specialty}
                                </p>
                                <p className="text-gray-700 mb-4">
                                    <span className="font-medium">License:</span> {doctor.license_number}
                                </p>
                                <Link
                                    to={`/doctor/${doctor.id}/schedule`}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    <FileText className="h-4 w-4" />
                                    View Availability
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            {specialty
                                ? `No doctors found for "${specialty}"`
                                : 'Enter a specialty to search for doctors'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorSearchPage;