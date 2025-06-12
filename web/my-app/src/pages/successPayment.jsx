import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { bookRDV } from '../api/rendezVous';
import Lottie from 'react-lottie';
import loading from '../constants/loading.json';

export default function SuccessPayment() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('');  // 'SUCCESS' | 'FAILURE' | ''
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const paymentId = searchParams.get("payment_id");
        const user = JSON.parse(localStorage.getItem("user"));
        const doctorId = localStorage.getItem("doctorId");
        const dateString = localStorage.getItem("date");
        const amount = localStorage.getItem("amount");

        axios.post(`/payment/${paymentId}`, { doctorId, amount })
            .then(async (res) => {
                const paymentStatus = res.data.result?.status;
                setStatus(paymentStatus);
                if (paymentStatus === 'SUCCESS' && user && doctorId && dateString) {
                    try {
                        await bookRDV({
                            patientId: user._id,
                            doctorId,
                            date: new Date(dateString),
                        });
                        // Clean up localStorage
                        localStorage.removeItem("doctorId");
                        localStorage.removeItem("date");
                        localStorage.removeItem("amount");
                    } catch (err) {
                        console.error('Booking after payment failed:', err);
                    }
                }
            })
            .catch(err => {
                console.error(err);
                setStatus('FAILURE');
            });
    }, []);

    const loadingOptions = {
        loop: true,
        autoplay: true,
        animationData: loading,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    };

    if (!status) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Lottie options={loadingOptions} height={300} width={300} />
                <p className="font-mono text-gray-500 mt-4">Verifying payment...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            {status === 'SUCCESS' ? (
                <div className="flex flex-col items-center gap-6 bg-white rounded-2xl shadow-lg border border-green-200 p-12 max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-mono font-bold text-gray-900 mb-2">Payment Successful</h2>
                        <p className="font-mono text-gray-500 text-sm">Your appointment has been booked successfully.</p>
                    </div>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-green-600 text-white font-mono font-medium rounded-xl hover:bg-green-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 bg-white rounded-2xl shadow-lg border border-red-200 p-12 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-mono font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="font-mono text-gray-500 text-sm">Something went wrong. Please try again.</p>
                    </div>
                    <Link
                        to="/request_appointment"
                        className="px-6 py-3 bg-red-500 text-white font-mono font-medium rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </Link>
                </div>
            )}
        </div>
    );
}
