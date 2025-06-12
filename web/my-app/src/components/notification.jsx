import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { IoNotifications } from "react-icons/io5";
import NotifCard from './notifCard';

export default function Notification({ count, notifications, onOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return null;

    const userNotifications = notifications.filter(n => n.user === user._id);

    const toggleDropdown = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (next && onOpen) onOpen();
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleDropdown}
                aria-label="Notifications"
            >
                <IoNotifications className="w-6 h-6 text-gray-600" />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 font-mono">Notifications</h3>
                        {count > 0 && (
                            <span className="text-xs font-mono text-blue-600 font-semibold">
                                {count} new
                            </span>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {userNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <IoNotifications className="w-10 h-10 mb-2 opacity-30" />
                                <p className="text-sm font-mono">No notifications</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {userNotifications.map((notif, key) => (
                                    <li key={key}>
                                        <NotifCard
                                            type={notif.type}
                                            text={notif.text}
                                            createdAt={convertToReadableDate(notif.createdAt)}
                                            isSeen={notif.isSeen}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function convertToReadableDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
