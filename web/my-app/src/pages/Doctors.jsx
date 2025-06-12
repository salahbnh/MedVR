import { useState, useEffect } from 'react';
import { AnimatedPinCard } from '../components/framer_components/pinCard';
import Lottie from 'react-lottie';
import notFound from '../constants/notFound.json';
import axios from '../api/axios';

const GET_DOCTORS_URL = '/user/doctors';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(GET_DOCTORS_URL);
                if (response.status === 200) {
                    setDoctors(response.data.doctors);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doctor => {
        const fullName = `${doctor.fName} ${doctor.lName}`.toLowerCase();
        const specialization = (doctor.specialization || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = fullName.includes(searchLower) || specialization.includes(searchLower);
        const isNotSelf = !user || doctor._id !== user._id;
        return matchesSearch && isNotSelf;
    });

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: notFound,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
    };

    return (
        <div className="flex flex-col items-center w-full pt-12 pb-20 px-6">
            {/* Header */}
            <div className="text-center mb-10 mt-6">
                <h1 className="text-5xl font-mono font-extrabold text-slate-900">Our Doctors</h1>
                <p className="text-lg font-mono text-slate-500 mt-3">
                    Browse our specialists and book an appointment in minutes
                </p>
            </div>

            {/* Search */}
            <div className="w-full max-w-xl mb-10">
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-xl font-mono text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
                {filteredDoctors.length > 0 && (
                    <p className="text-sm font-mono text-gray-400 mt-2 text-center">
                        {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
                    </p>
                )}
            </div>

            {/* Cards grid */}
            {filteredDoctors.length > 0 ? (
                <div
                    className="w-full max-w-7xl"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        justifyItems: 'center',
                    }}
                >
                    {filteredDoctors.map((doctor, index) => (
                        <AnimatedPinCard key={index} doctor={doctor} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10">
                    <Lottie options={defaultOptions} height={320} width={320} />
                    <p className="font-mono text-gray-400 mt-4">No doctors found matching your search</p>
                </div>
            )}
        </div>
    );
}
