// components/venue/ShowsList.js
"use client";

import { AlertCircle, Calendar, Clock, Edit2, Music, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ShowsList({ shows, onEdit, onDelete, loading }) {
    const [selectedShow, setSelectedShow] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';

        // Convert 24h to 12h format if needed
        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        }
        return timeString;
    };

    // Check if show date is in the past
    const isPastShow = (dateString) => {
        const showDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        showDate.setHours(0, 0, 0, 0);
        return showDate < today;
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!shows || shows.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <Music size={40} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No shows scheduled yet</p>
                <p className="text-gray-500 text-sm mt-1">Click "Add New Show" to create one</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {shows.map((show, index) => {
                const pastShow = isPastShow(show.date);

                return (
                    <div
                        key={show._id || index}
                        className={`bg-white border rounded-xl p-4 transition-shadow ${pastShow
                                ? 'border-gray-200 opacity-75 hover:shadow-md'
                                : 'border-gray-200 hover:shadow-md'
                            }`}
                    >
                        <div className="flex gap-4">
                            {/* Show Image */}
                            {show.image && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={show.image.url || show.image}
                                        alt={show.artistBandName || show.artist}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Show Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {show.artistBandName || show.artist}
                                    </h3>
                                    {pastShow && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            <AlertCircle size={10} />
                                            Past Show
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span className={pastShow ? 'text-gray-500' : ''}>
                                            {formatDate(show.date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{formatTime(show.eventTime || show.time)}</span>
                                    </div>
                                </div>

                                {show.description && (
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                        {show.description}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {!pastShow ? (
                                    // Future shows - both Edit and Delete enabled
                                    <>
                                        <button
                                            onClick={() => onEdit(show)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit show"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(show)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete show"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                ) : (
                                    // Past shows - Only Delete enabled, Edit disabled
                                    <>
                                        <button
                                            disabled
                                            className="p-2 text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed"
                                            title="Past shows cannot be edited"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(show)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete show"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}