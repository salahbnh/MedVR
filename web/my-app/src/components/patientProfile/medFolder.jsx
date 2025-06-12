import React, { useState, useEffect, useRef } from 'react';
import { getMedicalFolder, modifyMedicalFolder } from '../../api/medicalFolder';

export default function MedFolder() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [medFolder, setMedFolder] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ medications: '', allergies: '', testResults: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current || !user) return;
        hasFetched.current = true;
        const fetchMedFolder = async () => {
            try {
                const response = await getMedicalFolder(user._id, user._id);
                const folder = response.data.response;
                setMedFolder(folder);
                setForm({
                    medications: folder.medications || '',
                    allergies: folder.allergies || '',
                    testResults: folder.testResults || '',
                });
            } catch (err) {
                setError('Could not load medical folder.');
                console.error(err);
            }
        };
        fetchMedFolder();
    }, []);

    const handleSave = async () => {
        if (!medFolder) return;
        setSaving(true);
        try {
            const updated = await modifyMedicalFolder(
                user._id, user._id,
                form.medications, form.allergies, form.testResults
            );
            setMedFolder(updated.response);
            setEditing(false);
        } catch (err) {
            setError('Failed to save changes.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const fieldCss = 'w-full min-h-[100px] border border-gray-200 bg-gray-50 p-3 rounded-lg text-gray-800 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500';
    const labelCss = 'text-sm font-mono font-semibold text-gray-600 uppercase tracking-wide mb-1 mt-4 block';

    return (
        <div className="flex flex-col p-8 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-mono font-extrabold text-gray-900">Medical Information</h1>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 text-sm font-mono font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 text-sm font-mono font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 text-sm font-mono font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-sm">
                    {error}
                </div>
            )}

            {!medFolder && !error && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {medFolder && (
                <div>
                    <label className={labelCss}>Medications</label>
                    {editing ? (
                        <textarea className={fieldCss} value={form.medications} onChange={e => setForm(p => ({ ...p, medications: e.target.value }))} />
                    ) : (
                        <div className={fieldCss}>{medFolder.medications || <span className="text-gray-400 italic">None recorded</span>}</div>
                    )}

                    <label className={labelCss}>Allergies</label>
                    {editing ? (
                        <textarea className={fieldCss} value={form.allergies} onChange={e => setForm(p => ({ ...p, allergies: e.target.value }))} />
                    ) : (
                        <div className={fieldCss}>{medFolder.allergies || <span className="text-gray-400 italic">None recorded</span>}</div>
                    )}

                    <label className={labelCss}>Test Results</label>
                    {editing ? (
                        <textarea className={fieldCss} value={form.testResults} onChange={e => setForm(p => ({ ...p, testResults: e.target.value }))} />
                    ) : (
                        <div className={fieldCss}>{medFolder.testResults || <span className="text-gray-400 italic">None recorded</span>}</div>
                    )}
                </div>
            )}
        </div>
    );
}
