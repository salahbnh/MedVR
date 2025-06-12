import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from '../api/user';
import img1 from '../assets/img1.jpg';

export default function UserAvatar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on navigation
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location.pathname]);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return null;

    const role = user.role;
    const username = `${user.fName} ${user.lName}`;
    const profilePath = role === 'doctor'
        ? '/userProfile/doctorProfile'
        : '/userProfile/patientProfile';

    const handleSignOut = async () => {
        try {
            await logoutUser();
        } catch (_) { /* ignore */ }
        localStorage.clear();
        navigate('/login');
    };

    const close = () => setIsDropdownOpen(false);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsDropdownOpen(p => !p)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="User menu"
            >
                <img
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow"
                    src={img1}
                    alt="User avatar"
                />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold font-mono text-gray-900 truncate">{username}</p>
                        <p className="text-xs font-mono text-gray-500 truncate">{user.email}</p>
                    </div>
                    <ul className="py-1">
                        <li>
                            <Link
                                to={profilePath}
                                onClick={close}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-mono text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                My Profile
                            </Link>
                        </li>
                        {role === 'patient' && (
                            <li>
                                <Link
                                    to="/userProfile/patientProfile"
                                    onClick={close}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-mono text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Medical History
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-mono text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
