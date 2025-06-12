import { Link, useLocation } from 'react-router-dom';
import Dropdown from './dropdown';
import { useResponsive } from '../hooks/useResponsive';
import UserAvatar from './userAvatar';
import { useEffect, useState } from 'react';
import Notification from './notification';
import { useSocket } from '../context/socketProvider';
import { useNotificationsStore } from '../store/store';

export default function NavBar() {
    const isMobile = useResponsive();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isConnected = !!user;

    const { socket } = useSocket();
    const { notifications, fetchNotifications, addNotification, markAllSeen } = useNotificationsStore();

    // Fetch notifications on mount if logged in
    useEffect(() => {
        if (isConnected) {
            fetchNotifications();
        }
    }, [isConnected, fetchNotifications]);

    // Listen for real-time notifications via socket
    useEffect(() => {
        if (!socket || !user) return;
        const handler = (data) => {
            if (data.notification) {
                addNotification(data.notification);
            }
        };
        socket.on('addNotification', handler);
        return () => socket.off('addNotification', handler);
    }, [socket, user, addNotification]);

    const unseenCount = notifications.filter(n => !n.isSeen && n.user === user?._id).length;

    const handleNotifOpen = () => {
        if (unseenCount > 0) {
            markAllSeen();
        }
    };

    const navLinkClass = "font-mono text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium py-1 border-b-2 border-transparent hover:border-blue-600";
    const activeNavLinkClass = "font-mono text-blue-600 text-sm font-semibold py-1 border-b-2 border-blue-600";

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm h-16 flex items-center" style={{ zIndex: 9999 }}>
            <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 w-full">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">MC</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-gray-900 hidden sm:block">Medical Clinic</span>
                </Link>

                {isMobile ? (
                    <Dropdown />
                ) : (
                    <div className="flex items-center gap-6">
                        <ul className="flex items-center gap-6">
                            <li>
                                <Link to="/" className={isActive('/') && location.pathname === '/' ? activeNavLinkClass : navLinkClass}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/Services" className={isActive('/Services') ? activeNavLinkClass : navLinkClass}>
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/doctors" className={isActive('/doctors') ? activeNavLinkClass : navLinkClass}>
                                    Doctors
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/request_appointment"
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-mono font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Book Appointment
                                </Link>
                            </li>
                        </ul>

                        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                            {!isConnected && (
                                <Link to="/login">
                                    <button className="px-4 py-2 text-sm font-mono font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        Login
                                    </button>
                                </Link>
                            )}
                            {isConnected && (
                                <div className="flex items-center gap-2">
                                    <Notification
                                        count={unseenCount}
                                        notifications={notifications}
                                        onOpen={handleNotifOpen}
                                    />
                                    <UserAvatar />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
