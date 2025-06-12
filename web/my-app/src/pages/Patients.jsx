import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { getMedicalFolder, giveMedicalFolderAccess, removeMedicalFolderAccess } from '../api/medicalFolder';
import img1 from '../assets/img1.jpg';

export default function Patients() {
    const { patientId } = useParams();
    const viewer = JSON.parse(localStorage.getItem("user"));
    const [patient, setPatient] = useState(null);
    const [medFolder, setMedFolder] = useState(null);
    const [folderError, setFolderError] = useState('');
    const [accessLoading, setAccessLoading] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        axios.get(`/user/users/${patientId}`)
            .then(resp => setPatient(resp.data))
            .catch(err => console.error(err));
    }, [patientId]);

    const fetchMedFolder = async () => {
        if (!viewer) return;
        try {
            const response = await getMedicalFolder(patientId, viewer._id);
            setMedFolder(response.data.response);
            setHasAccess(true);
            setFolderError('');
        } catch (err) {
            setFolderError('Access denied or folder unavailable.');
            setHasAccess(false);
        }
    };

    const handleRequestAccess = async () => {
        if (!viewer) return;
        setAccessLoading(true);
        try {
            await giveMedicalFolderAccess(patientId, viewer._id);
            await fetchMedFolder();
        } catch (err) {
            setFolderError('Failed to request access.');
        } finally {
            setAccessLoading(false);
        }
    };

    const handleRevokeAccess = async () => {
        if (!viewer) return;
        setAccessLoading(true);
        try {
            await removeMedicalFolderAccess(patientId, viewer._id);
            setMedFolder(null);
            setHasAccess(false);
        } catch (err) {
            setFolderError('Failed to revoke access.');
        } finally {
            setAccessLoading(false);
        }
    };

    const fieldCss = 'w-full min-h-[80px] border border-gray-200 bg-gray-50 p-3 rounded-lg text-gray-800 font-mono text-sm leading-relaxed';

    return (
        <div className="flex flex-col gap-8 p-8 pt-24 max-w-5xl mx-auto">
            {/* Patient Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-mono font-extrabold text-gray-900 mb-6">Patient Details</h1>
                <div className="flex items-start gap-8">
                    <img src={img1} alt="Patient" className="w-28 h-28 rounded-2xl object-cover shadow-md flex-shrink-0" />
                    {patient ? (
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <InfoRow label="Full Name" value={`${patient.fName} ${patient.lName}`} />
                            <InfoRow label="Email" value={patient.email} />
                            <InfoRow label="Date of Birth" value={patient.dateOfBirth?.split('T')[0]} />
                            <InfoRow label="Address" value={patient.address} />
                            <InfoRow label="Phone" value={patient.phoneNbr} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-mono text-gray-500">Loading patient info...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Medical Folder */}
            {viewer?.role === 'doctor' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-mono font-bold text-gray-900">Medical Folder</h2>
                        <div className="flex gap-2">
                            {!hasAccess && (
                                <button
                                    onClick={handleRequestAccess}
                                    disabled={accessLoading}
                                    className="px-4 py-2 text-sm font-mono font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {accessLoading ? 'Requesting...' : 'Request Access'}
                                </button>
                            )}
                            {hasAccess && (
                                <button
                                    onClick={handleRevokeAccess}
                                    disabled={accessLoading}
                                    className="px-4 py-2 text-sm font-mono font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                                >
                                    {accessLoading ? 'Revoking...' : 'Revoke Access'}
                                </button>
                            )}
                            {!medFolder && (
                                <button
                                    onClick={fetchMedFolder}
                                    className="px-4 py-2 text-sm font-mono font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    View Folder
                                </button>
                            )}
                        </div>
                    </div>

                    {folderError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-sm">
                            {folderError}
                        </div>
                    )}

                    {medFolder && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-1">Medications</p>
                                <div className={fieldCss}>{medFolder.medications || <span className="text-gray-400 italic">None recorded</span>}</div>
                            </div>
                            <div>
                                <p className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-1">Allergies</p>
                                <div className={fieldCss}>{medFolder.allergies || <span className="text-gray-400 italic">None recorded</span>}</div>
                            </div>
                            <div>
                                <p className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-1">Test Results</p>
                                <div className={fieldCss}>{medFolder.testResults || <span className="text-gray-400 italic">None recorded</span>}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
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
