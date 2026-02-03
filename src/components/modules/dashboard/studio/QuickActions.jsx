"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function QuickActions({ actions }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                    <span className="text-sm text-gray-500">Complete tasks to boost your profile</span>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="group block"
                        >
                            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                {/* Badge */}
                                {action.badge && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {action.badge}
                                    </span>
                                )}

                                {/* Icon */}
                                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {action.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center text-blue-600 text-sm font-medium">
                                    <span>Take action</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Need help? Check our guide</span>
                    <Link
                        href="/dashboard/studio/help"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                        View Guide
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Alternative: Quick Action Buttons
export function QuickActionButtons({ actions }) {
    return (
        <div className="flex flex-wrap gap-3">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.onClick}
                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.subtitle}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}