import React from 'react';
import { Link } from 'react-router-dom';

export default function FailPayment() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="flex flex-col items-center gap-6 bg-white rounded-2xl shadow-lg border border-red-200 p-12 max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-mono font-bold text-gray-900 mb-2">Payment Failed</h2>
                    <p className="font-mono text-gray-500 text-sm">
                        Your payment was not completed. No charges have been made.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/request_appointment"
                        className="px-6 py-3 bg-blue-600 text-white font-mono font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-mono font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
