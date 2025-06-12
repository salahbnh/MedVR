import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-gray-300 pt-12 pb-6 px-6 mt-auto">
            <div className="max-w-6xl mx-auto">
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '2.5rem',
                    }}
                >
                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">MC</span>
                            </div>
                            <span className="text-white font-bold font-mono text-lg">Medical Clinic</span>
                        </div>
                        <p className="text-sm font-mono text-gray-400 leading-relaxed">
                            Modern healthcare delivered with compassion. Book appointments, consult specialists, and manage your health — all in one place.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-white font-semibold font-mono mb-4">Quick Links</h4>
                        <ul className="flex flex-col gap-2">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Services', to: '/Services' },
                                { label: 'Our Doctors', to: '/doctors' },
                                { label: 'Book Appointment', to: '/request_appointment' },
                            ].map(({ label, to }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm font-mono text-gray-400 hover:text-white transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold font-mono mb-4">Services</h4>
                        <ul className="flex flex-col gap-2">
                            {[
                                'In-Person Consultation',
                                'Video Consultation',
                                'Medical Prescription',
                                'Follow-up Appointment',
                            ].map(s => (
                                <li key={s}>
                                    <span className="text-sm font-mono text-gray-400">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold font-mono mb-4">Contact</h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-start gap-2 text-sm font-mono text-gray-400">
                                <FaLocationDot className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                123 Health Avenue, Tunis, Tunisia
                            </li>
                            <li className="flex items-center gap-2 text-sm font-mono text-gray-400">
                                <FaPhone className="w-4 h-4 text-blue-400 shrink-0" />
                                +216 71 000 000
                            </li>
                            <li className="flex items-center gap-2 text-sm font-mono text-gray-400">
                                <FaEnvelope className="w-4 h-4 text-blue-400 shrink-0" />
                                contact@medicalclinic.tn
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs font-mono text-gray-500">
                        &copy; {year} Medical Clinic. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-xs font-mono text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="text-xs font-mono text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
