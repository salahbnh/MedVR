import React from 'react';
import { IoCalendarOutline } from 'react-icons/io5';

export default function NotifCard({ type, text, createdAt, isSeen }) {
    return (
        <div className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!isSeen ? 'bg-blue-50' : ''}`}>
            <div className="flex-shrink-0 mt-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!isSeen ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <IoCalendarOutline className={`w-4 h-4 ${!isSeen ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold font-mono text-gray-800 truncate">{type}</p>
                <p className="text-xs font-mono text-gray-600 mt-0.5 leading-relaxed">{text}</p>
                <p className="text-xs font-mono text-gray-400 mt-1">{createdAt}</p>
            </div>
            {!isSeen && (
                <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
            )}
        </div>
    );
}
