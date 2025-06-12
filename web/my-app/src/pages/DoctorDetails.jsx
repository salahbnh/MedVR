import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import img1 from '../assets/img1.jpg';
import RdvBook from '../components/rdvBook';
import { giveMedicalFolderAccess } from '../api/medicalFolder';

const DoctorDetails = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [accessGranted, setAccessGranted] = useState(false);
    const [accessError, setAccessError] = useState('');
    const hasFetched = useRef(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const isPatient = user?.role === 'patient';

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        axios.get(`/user/users/${doctorId}`)
            .then(resp => setDoctor(resp.data))
            .catch(err => console.error(err));
    }, [doctorId]);

    const giveAccess = async () => {
        if (!user) return;
        try {
            await giveMedicalFolderAccess(user._id, doctorId);
            setAccessGranted(true);
            setAccessError('');
        } catch (err) {
            setAccessError('Failed to grant access. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col gap-6 px-8 py-6 pt-24 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Doctor Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-mono font-extrabold text-gray-900 mb-6">Doctor Details</h1>
                    <div className="flex items-start gap-6">
                        <img src={img1} alt="Doctor" className="w-24 h-24 rounded-2xl object-cover shadow-md flex-shrink-0" />
                        {doctor ? (
                            <div className="grid grid-cols-1 gap-3 flex-1">
                                <InfoRow label="Name" value={"Dr. " + doctor.fName + " " + doctor.lName} />
                                <InfoRow label="Specialization" value={doctor.specialization} />
                                <InfoRow label="Experience" value={doctor.yearsOfExperience ? doctor.yearsOfExperience + " years" : null} />
                                <InfoRow label="Email" value={doctor.email} />
                                <InfoRow label="Address" value={doctor.address} />
                                <InfoRow label="Phone" value={doctor.phoneNbr} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="font-mono text-gray-500">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Appointment */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-mono font-extrabold text-gray-900 mb-6">Book an Appointment</h1>
                    <RdvBook doctorId={doctorId} />
                </div>
            </div>

            {/* Medical Access - patients only */}
            {isPatient && doctor && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-mono font-bold text-gray-900 mb-2">Grant Medical Folder Access</h2>
                    <p className="text-sm font-mono text-gray-500 mb-5">
                        Allow Dr. {doctor.fName} {doctor.lName} to view your medical information. You can revoke this access at any time.
                    </p>
                    {accessError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-sm">{accessError}</div>
                    )}
                    {accessGranted ? (
                        <p className="text-green-700 font-mono text-sm font-semibold">Access granted successfully.</p>
                    ) : (
                        <button onClick={giveAccess} className="px-6 py-2.5 bg-blue-600 text-white font-mono font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors">
                            Allow Access
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-mono text-gray-800 font-medium">{value || "—"}</span>
        </div>
    );
}

export default DoctorDetails;
