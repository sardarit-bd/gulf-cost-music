"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, change, icon: Icon, color, trend = "up" }) {
    return (
        <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-200">
            {/* Background accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full -translate-y-12 translate-x-12`}></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Trend indicator */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {trend === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{change}</span>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
                </div>

                {/* Progress bar (optional) */}
                <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Monthly growth</span>
                        <span>{trend === 'up' ? '+12%' : '-5%'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: trend === 'up' ? '75%' : '30%' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Alternative minimalist version
export function SimpleStatCard({ title, value, icon: Icon, color = "blue" }) {
    const colorMap = {
        blue: "bg-blue-500 text-blue-600",
        green: "bg-green-500 text-green-600",
        purple: "bg-purple-500 text-purple-600",
        orange: "bg-orange-500 text-orange-600",
        red: "bg-red-500 text-red-600",
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${colorMap[color].split(' ')[0]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}