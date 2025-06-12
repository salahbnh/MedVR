import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function Payment() {
    const navigate = useNavigate();
    const [doctorName, setDoctorName] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const doctorId = localStorage.getItem("doctorId");
    const dateString = localStorage.getItem("date");

    useEffect(() => {
        if (!doctorId || !dateString) {
            navigate('/request_appointment');
            return;
        }
        const storedAmount = localStorage.getItem("amount") || '50000';
        setAmount(storedAmount);
        setDate(new Date(dateString).toLocaleString('en-GB', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        }));

        axios.get(`/user/users/${doctorId}`)
            .then(res => setDoctorName(`Dr. ${res.data.fName} ${res.data.lName}`))
            .catch(() => setDoctorName('Unknown Doctor'));
    }, []);

    const handlePay = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/payment/add', {
                amount,
                doctorId,
            });
            const payUrl = response.data.result?.link;
            if (payUrl) {
                window.location.href = payUrl;
            } else {
                setError('Could not initiate payment. Please try again.');
            }
        } catch (err) {
            setError('Payment initiation failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 w-full max-w-md">
                <h1 className="text-2xl font-mono font-extrabold text-gray-900 mb-2">Confirm Appointment</h1>
                <p className="font-mono text-gray-500 text-sm mb-8">Review the details below before proceeding to payment.</p>

                <div className="flex flex-col gap-4 mb-8">
                    <SummaryRow label="Doctor" value={doctorName || 'Loading...'} />
                    <SummaryRow label="Date & Time" value={date} />
                    <SummaryRow label="Consultation Fee" value={`${(parseInt(amount) / 1000).toFixed(2)} DT`} />
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-mono text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white font-mono font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Redirecting to payment...' : 'Pay Now'}
                    </button>
                    <Link
                        to="/request_appointment"
                        className="w-full py-3 bg-gray-100 text-gray-700 font-mono font-medium rounded-xl hover:bg-gray-200 transition-colors text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-mono text-gray-500">{label}</span>
            <span className="text-sm font-mono font-semibold text-gray-900">{value}</span>
        </div>
    );
}
