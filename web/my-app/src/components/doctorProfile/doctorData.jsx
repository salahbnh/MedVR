import React from 'react';
import img1 from '../../assets/img1.jpg';

export default function DoctorData() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return null;

    return (
        <div className="flex flex-col p-8 max-w-2xl">
            <h1 className="text-2xl font-mono font-extrabold text-gray-900 mb-8">Account Information</h1>
            <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                    <img
                        src={img1}
                        alt="Profile"
                        className="w-28 h-28 rounded-2xl object-cover shadow-md"
                    />
                </div>
                <div className="flex-1 grid grid-cols-1 gap-4">
                    <InfoRow label="Full Name" value={`Dr. ${user.fName} ${user.lName}`} />
                    <InfoRow label="Email" value={user.email} />
                    <InfoRow label="Specialization" value={user.specialization} />
                    <InfoRow label="Experience" value={user.yearsOfExperience ? `${user.yearsOfExperience} years` : null} />
                    <InfoRow label="Address" value={user.address} />
                    <InfoRow label="Phone" value={user.phoneNbr} />
                    <InfoRow label="Wallet" value={user.wallet ? `${(user.wallet / 1000).toFixed(2)} DT` : '0.00 DT'} />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-mono text-gray-800 font-medium">{value || '—'}</span>
        </div>
    );
}
