import { useState, useEffect } from 'react';
import axios from '../api/axios';
import RdvBook from '../components/rdvBook';
import Lottie from 'react-lottie';
import notFound from '../constants/notFound.json';
import { FaUserDoctor, FaCalendarCheck, FaArrowLeft, FaMagnifyingGlass } from 'react-icons/fa6';

const GET_DOCTORS_URL = '/user/doctors';

function StepIndicator({ current }) {
    const steps = [
        { num: 1, label: 'Choose Doctor', icon: <FaUserDoctor className="w-4 h-4" /> },
        { num: 2, label: 'Book Appointment', icon: <FaCalendarCheck className="w-4 h-4" /> },
    ];
    return (
        <div className="flex items-center gap-4 mb-10">
            {steps.map((s, i) => (
                <div key={s.num} className="flex items-center gap-2">
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            current >= s.num
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                        {s.num}
                    </div>
                    <span
                        className={`font-mono text-sm font-semibold hidden sm:block ${
                            current >= s.num ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        {s.label}
                    </span>
                    {i < steps.length - 1 && (
                        <div className={`h-0.5 w-12 mx-2 rounded ${current > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

function DoctorCard({ doctor, onSelect }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isSelf = user && doctor._id === user._id;
    if (isSelf) return null;

    return (
        <button
            onClick={() => onSelect(doctor)}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-5 flex items-center gap-4 group"
        >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <FaUserDoctor className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold font-mono text-slate-900 truncate">
                    Dr. {doctor.fName} {doctor.lName}
                </p>
                <p className="text-sm font-mono text-gray-500 truncate">
                    {doctor.specialization || 'General Practitioner'}
                </p>
                {doctor.email && (
                    <p className="text-xs font-mono text-gray-400 truncate mt-0.5">{doctor.email}</p>
                )}
            </div>
            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full shrink-0 group-hover:bg-blue-100 transition-colors">
                Select
            </span>
        </button>
    );
}

export default function RequestAppointment() {
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(GET_DOCTORS_URL);
                if (response.status === 200) {
                    setDoctors(response.data.doctors || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filtered = doctors.filter(doc => {
        const fullName = `${doc.fName} ${doc.lName}`.toLowerCase();
        const spec = (doc.specialization || '').toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || spec.includes(searchTerm.toLowerCase());
    });

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: notFound,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    };

    return (
        <div className="flex flex-col items-center w-full pt-12 pb-20 px-6">
            {/* Header */}
            <div className="text-center mb-8 mt-4">
                <h1 className="text-5xl font-extrabold font-mono text-slate-900">Book an Appointment</h1>
                <p className="text-lg font-mono text-slate-500 mt-3">
                    Find a specialist and schedule your visit in minutes
                </p>
            </div>

            <div className="w-full max-w-3xl">
                <StepIndicator current={step} />

                {/* Step 1: Choose Doctor */}
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative mb-2">
                            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or specialization..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-5 py-3 border border-gray-200 rounded-xl font-mono text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {loading ? (
                            <div className="flex flex-col gap-3 mt-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {filtered.map((doc, i) => (
                                    <DoctorCard key={i} doctor={doc} onSelect={handleSelectDoctor} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10">
                                <Lottie options={defaultOptions} height={240} width={240} />
                                <p className="font-mono text-gray-400 mt-4">No doctors found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Book Appointment */}
                {step === 2 && selectedDoctor && (
                    <div className="flex flex-col gap-6">
                        {/* Back button */}
                        <button
                            onClick={() => setStep(1)}
                            className="self-start flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" /> Back to doctors
                        </button>

                        {/* Selected doctor summary */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                <FaUserDoctor className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold font-mono text-slate-900">
                                    Dr. {selectedDoctor.fName} {selectedDoctor.lName}
                                </p>
                                <p className="text-sm font-mono text-blue-600">
                                    {selectedDoctor.specialization || 'General Practitioner'}
                                </p>
                            </div>
                            <span className="ml-auto text-sm font-mono font-bold text-slate-700 bg-white border border-gray-200 px-3 py-1 rounded-full">
                                70 DT
                            </span>
                        </div>

                        {/* Booking widget */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold font-mono text-slate-900 text-lg mb-5">
                                Select Date &amp; Time
                            </h3>
                            <RdvBook doctorId={selectedDoctor._id} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
