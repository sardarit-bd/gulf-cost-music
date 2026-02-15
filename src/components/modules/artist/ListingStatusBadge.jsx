"use client";

import { BadgeCheck, Calendar } from "lucide-react";

export default function ListingStatusBadge({ status, createdAt }) {
    const statusConfig = {
        active: {
            label: "Active",
            color: "text-green-600",
            bg: "bg-green-100",
            border: "border-green-200",
            icon: "🟢",
            gradient: "from-green-50 to-emerald-50",
        },
        hidden: {
            label: "Hidden",
            color: "text-yellow-600",
            bg: "bg-yellow-100",
            border: "border-yellow-200",
            icon: "👁️‍🗨️",
            gradient: "from-yellow-50 to-amber-50",
        },
        sold: {
            label: "Sold",
            color: "text-red-600",
            bg: "bg-red-100",
            border: "border-red-200",
            icon: "💰",
            gradient: "from-red-50 to-rose-50",
        },
        reserved: {
            label: "Reserved",
            color: "text-orange-600",
            bg: "bg-orange-100",
            border: "border-orange-200",
            icon: "⏳",
            gradient: "from-orange-50 to-amber-50",
        },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
        <div className={`px-8 py-6 backdrop-blur-sm ${config.gradient} border-b border-gray-200`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${config.bg} ${config.border} border`}>
                        <span className="text-2xl">{config.icon}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-gray-600">LISTING STATUS</h3>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`}></div>
                                <span className={`text-sm font-bold ${config.color}`}>
                                    {config.label}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600">
                            {status === "active" && "Listing is live and visible to buyers"}
                            {status === "hidden" && "Listing is hidden from public view"}
                            {status === "sold" && "Item has been sold"}
                            {status === "reserved" && "Item is reserved for a buyer"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>Listed on</span>
                        </div>
                        <p className="font-bold text-gray-900">
                            {new Date(createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                        <BadgeCheck className="w-7 h-7 text-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}