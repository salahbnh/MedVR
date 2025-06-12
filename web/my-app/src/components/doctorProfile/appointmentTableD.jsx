import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AppointmentTableD({ appointments, onCancel }) {
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const formatDate = (date) =>
        `${new Date(date).toLocaleDateString('en-GB')} at ${new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    const openModal = (appointment) => {
        setSelectedAppointment(appointment);
        setReason('');
        setShowModal(true);
    };

    const handleCancel = async () => {
        if (!selectedAppointment || !reason.trim()) return;
        setCancelling(true);
        try {
            await onCancel(selectedAppointment._id, reason);
            setShowModal(false);
        } finally {
            setCancelling(false);
        }
    };

    const getPatientName = (appt) => {
        if (appt.patient && typeof appt.patient === 'object') {
            return `${appt.patient.fName} ${appt.patient.lName}`;
        }
        return 'Unknown';
    };

    const getPatientEmail = (appt) => {
        if (appt.patient && typeof appt.patient === 'object') return appt.patient.email;
        return '—';
    };

    const getPatientId = (appt) => {
        if (appt.patient && typeof appt.patient === 'object') return appt.patient._id;
        return appt.patient;
    };

    if (appointments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-lg font-mono">No appointments scheduled</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs font-mono uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appt, index) => (
                        <tr key={appt._id || index} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono font-semibold text-gray-900 whitespace-nowrap">
                                {getPatientName(appt)}
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-600 whitespace-nowrap">
                                {getPatientEmail(appt)}
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-700">
                                {formatDate(appt.date)}
                            </td>
                            <td className="px-6 py-4 flex items-center gap-4">
                                <Link
                                    to={`/patients/${getPatientId(appt)}`}
                                    className="text-sm font-mono font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    View Profile
                                </Link>
                                <button
                                    onClick={() => openModal(appt)}
                                    className="text-sm font-mono font-semibold text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-xl font-mono font-bold text-gray-900 mb-2">Cancel Appointment</h2>
                        <p className="text-sm font-mono text-gray-500 mb-6">
                            Please provide a reason for cancellation.
                        </p>
                        <input
                            type="text"
                            placeholder="Reason for cancellation..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 mb-6"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 font-mono text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={!reason.trim() || cancelling}
                                className="px-5 py-2 font-mono text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
