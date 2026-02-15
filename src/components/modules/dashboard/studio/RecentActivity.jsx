"use client";

import {
    Calendar,
    Camera,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    MessageSquare,
    Music,
    Package,
    Star,
    UserPlus
} from "lucide-react";
import { useState } from "react";

const activityTypes = {
    booking: { icon: Calendar, color: "text-blue-600 bg-blue-50" },
    view: { icon: Eye, color: "text-green-600 bg-green-50" },
    like: { icon: Star, color: "text-yellow-600 bg-yellow-50" },
    follow: { icon: UserPlus, color: "text-purple-600 bg-purple-50" },
    message: { icon: MessageSquare, color: "text-pink-600 bg-pink-50" },
    purchase: { icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    upload: { icon: Camera, color: "text-orange-600 bg-orange-50" },
    service: { icon: Package, color: "text-indigo-600 bg-indigo-50" },
    play: { icon: Music, color: "text-red-600 bg-red-50" }
};

export default function RecentActivity() {
    const [activities] = useState([
        {
            id: 1,
            type: "booking",
            title: "New Studio Booking",
            description: "John Doe booked 'Mixing & Mastering' service",
            time: "10 minutes ago",
            user: "John Doe",
            amount: "$149"
        },
        {
            id: 2,
            type: "view",
            title: "Profile Viewed",
            description: "Your studio profile was viewed 24 times today",
            time: "1 hour ago",
            count: 24
        },
        {
            id: 3,
            type: "upload",
            title: "Audio Uploaded",
            description: "New demo track added to your portfolio",
            time: "2 hours ago",
            track: "Summer Vibes.mp3"
        },
        {
            id: 4,
            type: "service",
            title: "Service Inquiry",
            description: "Sarah Johnson inquired about recording rates",
            time: "3 hours ago",
            user: "Sarah Johnson"
        },
        {
            id: 5,
            type: "play",
            title: "Audio Played",
            description: "Your demo track was played 15 times",
            time: "5 hours ago",
            count: 15
        },
        {
            id: 6,
            type: "like",
            title: "New Follower",
            description: "Music Producer started following your studio",
            time: "1 day ago",
            user: "Music Producer"
        }
    ]);

    const [filter, setFilter] = useState("all");

    const filteredActivities = filter === "all"
        ? activities
        : activities.filter(activity => activity.type === filter);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                        <p className="text-sm text-gray-600 mt-1">Latest interactions with your studio</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Last 7 days</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 pt-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Activity
                    </button>
                    <button
                        onClick={() => setFilter("booking")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "booking"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Bookings
                    </button>
                    <button
                        onClick={() => setFilter("view")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "view"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Views
                    </button>
                    <button
                        onClick={() => setFilter("upload")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "upload"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Uploads
                    </button>
                </div>
            </div>

            {/* Activity List */}
            <div className="p-6">
                <div className="space-y-4">
                    {filteredActivities.map((activity) => {
                        const ActivityIcon = activityTypes[activity.type].icon;
                        const colorClass = activityTypes[activity.type].color;

                        return (
                            <div
                                key={activity.id}
                                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 ${colorClass.split(' ')[1]} rounded-lg flex items-center justify-center`}>
                                        <ActivityIcon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                                    {/* Additional Info */}
                                    <div className="flex items-center gap-4 mt-2">
                                        {activity.user && (
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {activity.user}
                                            </span>
                                        )}
                                        {activity.amount && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                {activity.amount}
                                            </span>
                                        )}
                                        {activity.count && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                {activity.count} times
                                            </span>
                                        )}
                                        {activity.track && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded truncate">
                                                {activity.track}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all">
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* View All */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View All Activity →
                    </button>
                </div>
            </div>
        </div>
    );
}

// Activity Timeline Version
export function ActivityTimeline() {
    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {activities.map((activity, index) => {
                const ActivityIcon = activityTypes[activity.type].icon;

                return (
                    <div key={index} className="relative flex items-start gap-4 mb-6">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex-shrink-0">
                            <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                                <ActivityIcon className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white rounded-xl p-4 shadow border border-gray-200">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}