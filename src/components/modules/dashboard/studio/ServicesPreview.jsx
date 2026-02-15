"use client";

import {
    CheckCircle,
    Clock,
    DollarSign,
    Package,
    Plus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ServicesPreview({ services = [] }) {
    const [showAll, setShowAll] = useState(false);

    // Mock popular services if none provided
    const defaultServices = [
        { _id: 1, service: "Mixing & Mastering", price: "$149", rating: 4.9, bookings: 24 },
        { _id: 2, service: "Vocal Recording", price: "$99/hr", rating: 4.8, bookings: 18 },
        { _id: 3, service: "Beat Production", price: "$199", rating: 4.7, bookings: 12 },
    ];

    const displayServices = services.length > 0 ? services : defaultServices;
    const visibleServices = showAll ? displayServices : displayServices.slice(0, 3);

    const getServiceColor = (index) => {
        const colors = [
            "bg-gradient-to-r from-blue-500 to-blue-600",
            "bg-gradient-to-r from-purple-500 to-purple-600",
            "bg-gradient-to-r from-green-500 to-green-600",
            "bg-gradient-to-r from-orange-500 to-orange-600",
            "bg-gradient-to-r from-pink-500 to-pink-600",
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Services & Pricing</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your studio services</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/studios/profile/services"
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Service
                        </Link>
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            {showAll ? "Show Less" : "View All"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="p-6">
                {displayServices.length === 0 ? (
                    <EmptyServicesState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleServices.map((service, index) => (
                            <ServiceCard
                                key={service._id || index}
                                service={service}
                                color={getServiceColor(index)}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{displayServices.length} services active</span>
                    </div>
                    {/* <Link
                        href="/dashboard/studios/profile/services"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                        Manage All Services
                        <Zap className="w-4 h-4" />
                    </Link> */}
                </div>
            </div>
        </div>
    );
}

function ServiceCard({ service, color, index }) {
    return (
        <div className="group relative overflow-hidden bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
            {/* Color accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${color}`}></div>

            <div className="p-5">
                {/* Service Icon */}
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center shadow`}>
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    {/* <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{service.rating || "4.8"}</span>
                    </div> */}
                </div>

                {/* Service Info */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.service}</h3>
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                        <span className="text-sm text-gray-500">per session</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>24h turnaround</span>
                        </div>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                            {service.bookings || 0} bookings
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {/* <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                    </button>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

function EmptyServicesState() {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add your first service to start attracting clients. Showcase what makes your studio unique!
            </p>
            <Link
                href="/dashboard/studios/profile/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-5 h-5" />
                Create Your First Service
            </Link>
        </div>
    );
}