import { Link } from 'react-router-dom';
import {
    FaHeartPulse, FaBrain, FaBone, FaEye, FaTooth, FaUserDoctor,
    FaCalendarCheck, FaVideo, FaFileMedical, FaStar, FaArrowRight
} from 'react-icons/fa6';
import { FaFlask } from 'react-icons/fa';

const departments = [
    { icon: <FaHeartPulse className="w-7 h-7" />, name: 'Cardiology', desc: 'Heart & cardiovascular care', color: 'bg-red-50 text-red-600' },
    { icon: <FaBrain className="w-7 h-7" />, name: 'Neurology', desc: 'Brain & nervous system', color: 'bg-purple-50 text-purple-600' },
    { icon: <FaBone className="w-7 h-7" />, name: 'Orthopedics', desc: 'Bones, joints & muscles', color: 'bg-orange-50 text-orange-600' },
    { icon: <FaEye className="w-7 h-7" />, name: 'Ophthalmology', desc: 'Eye care & vision', color: 'bg-blue-50 text-blue-600' },
    { icon: <FaTooth className="w-7 h-7" />, name: 'Dentistry', desc: 'Oral health & dental care', color: 'bg-cyan-50 text-cyan-600' },
    { icon: <FaFlask className="w-7 h-7" />, name: 'Laboratory', desc: 'Tests & diagnostics', color: 'bg-green-50 text-green-600' },
];

const services = [
    {
        icon: <FaUserDoctor className="w-6 h-6 text-blue-600" />,
        title: 'In-Person Consultation',
        desc: 'Face-to-face appointment with a specialist at the clinic.',
        price: '70 DT',
        tag: 'Most Popular',
    },
    {
        icon: <FaVideo className="w-6 h-6 text-violet-600" />,
        title: 'Video Consultation',
        desc: 'Consult with a doctor from the comfort of your home via video call.',
        price: '70 DT',
        tag: 'Remote',
    },
    {
        icon: <FaFileMedical className="w-6 h-6 text-emerald-600" />,
        title: 'Medical Prescription',
        desc: 'Get prescriptions and medication renewals without a visit.',
        price: '40 DT',
        tag: 'Quick',
    },
    {
        icon: <FaCalendarCheck className="w-6 h-6 text-amber-600" />,
        title: 'Follow-up Appointment',
        desc: 'Schedule a follow-up with your existing doctor seamlessly.',
        price: '50 DT',
        tag: 'Continuity',
    },
];

const stats = [
    { value: '50+', label: 'Specialist Doctors' },
    { value: '10K+', label: 'Patients Served' },
    { value: '6', label: 'Departments' },
    { value: '98%', label: 'Satisfaction Rate' },
];

const process = [
    { step: '01', title: 'Choose a Service', desc: 'Browse our services and select the consultation type that fits your needs.' },
    { step: '02', title: 'Pick a Doctor', desc: 'Find an available specialist and review their profile and availability.' },
    { step: '03', title: 'Book & Pay', desc: 'Select your preferred date/time and complete secure online payment.' },
    { step: '04', title: 'Get Care', desc: 'Attend your appointment in person or via video link — your choice.' },
];

export default function Services() {
    return (
        <div className="flex flex-col items-center w-full pb-20">
            {/* Hero */}
            <div className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-6 text-center">
                <h1 className="text-5xl font-extrabold font-mono mb-4">Our Services</h1>
                <p className="text-lg font-mono text-blue-100 max-w-2xl mx-auto">
                    Comprehensive medical care delivered by certified specialists — in person or online.
                </p>
                <Link
                    to="/request_appointment"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white text-blue-700 font-mono font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow"
                >
                    Book an Appointment <FaArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Stats */}
            <div className="w-full bg-white border-b border-gray-100 py-10 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <p className="text-4xl font-extrabold font-mono text-blue-600">{s.value}</p>
                            <p className="text-sm font-mono text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <div className="w-full max-w-6xl px-6 mt-16">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold font-mono text-slate-900">What We Offer</h2>
                    <p className="text-gray-500 font-mono mt-3">Choose the care model that works best for you</p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {services.map((svc, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                    {svc.icon}
                                </div>
                                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {svc.tag}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold font-mono text-slate-900">{svc.title}</h3>
                            <p className="text-sm font-mono text-gray-500 flex-1">{svc.desc}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xl font-extrabold font-mono text-slate-800">{svc.price}</span>
                                <Link
                                    to="/request_appointment"
                                    className="text-sm font-mono font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    Book <FaArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Departments */}
            <div className="w-full max-w-6xl px-6 mt-20">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold font-mono text-slate-900">Departments</h2>
                    <p className="text-gray-500 font-mono mt-3">Specialist care across all major medical fields</p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {departments.map((dept, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center gap-3"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dept.color}`}>
                                {dept.icon}
                            </div>
                            <h3 className="font-bold font-mono text-slate-900">{dept.name}</h3>
                            <p className="text-xs font-mono text-gray-500">{dept.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div className="w-full max-w-6xl px-6 mt-20">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold font-mono text-slate-900">How It Works</h2>
                    <p className="text-gray-500 font-mono mt-3">Get medical care in four simple steps</p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {process.map((p, i) => (
                        <div key={i} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <span className="text-5xl font-extrabold font-mono text-gray-100 absolute top-4 right-4 select-none">
                                {p.step}
                            </span>
                            <h3 className="font-bold font-mono text-slate-900 text-lg mb-2 relative z-10">{p.title}</h3>
                            <p className="text-sm font-mono text-gray-500 relative z-10">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonial / CTA banner */}
            <div className="w-full max-w-6xl px-6 mt-20">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 text-white text-center">
                    <FaStar className="w-8 h-8 mx-auto mb-4 text-yellow-300" />
                    <h2 className="text-3xl font-extrabold font-mono mb-3">Trusted by Thousands of Patients</h2>
                    <p className="font-mono text-blue-100 max-w-xl mx-auto mb-8">
                        Our doctors are certified specialists with years of experience. Book your appointment today and experience healthcare done right.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/doctors"
                            className="px-6 py-3 bg-white text-blue-700 font-mono font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            Meet Our Doctors
                        </Link>
                        <Link
                            to="/request_appointment"
                            className="px-6 py-3 bg-blue-800 text-white font-mono font-semibold rounded-xl hover:bg-blue-900 transition-colors"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
