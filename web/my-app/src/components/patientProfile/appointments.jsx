import React, { useEffect, useRef, useState } from 'react';
import AppointmentTable from './appointmentTable';
import { getUserRendezVous, cancelRDV } from '../../api/rendezVous';
import axios from '../../api/axios';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    const fetchData = async () => {
        try {
            const response = await getUserRendezVous(user._id);
            const rdvList = response.data.rendezVous || [];
            setAppointments(rdvList);
            autoDeletePast(rdvList);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchData();
    }, []);

    const autoDeletePast = async (rdvList) => {
        const now = Date.now();
        const expired = rdvList.filter(app => now - new Date(app.date).getTime() > 10800000);
        await Promise.all(expired.map(app =>
            axios.delete(`/rendezVous/deleteRDV/${app._id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: { reason: 'time passed' },
            }).catch(() => {})
        ));
    };

    const handleCancel = async (rdvId, reason) => {
        try {
            await cancelRDV({ rdvId, reason });
            setAppointments(prev => prev.filter(a => a._id !== rdvId));
        } catch (error) {
            console.error('Error canceling appointment:', error);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="flex items-center justify-between">
                <h1 className="font-mono font-extrabold text-gray-900 text-2xl">Your Appointments</h1>
                <span className="text-sm font-mono text-gray-500">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</span>
            </div>
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <AppointmentTable appointments={appointments} onCancel={handleCancel} />
            )}
        </div>
    );
}
