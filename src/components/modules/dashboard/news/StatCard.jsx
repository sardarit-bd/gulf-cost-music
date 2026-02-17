"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, change, color }) => {
    const colors = {
        orange: {
            bg: "bg-orange-50",
            iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
            text: "text-orange-600",
            border: "border-orange-200"
        },
        green: {
            bg: "bg-green-50",
            iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
            text: "text-green-600",
            border: "border-green-200"
        },
        red: {
            bg: "bg-red-50",
            iconBg: "bg-gradient-to-br from-red-500 to-pink-600",
            text: "text-red-600",
            border: "border-red-200"
        },
        blue: {
            bg: "bg-blue-50",
            iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
            text: "text-blue-600",
            border: "border-blue-200"
        }
    };

    const theme = colors[color] || colors.orange;
    const isPositive = change > 0;

    return (
        <div className={`relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                <div className={`absolute inset-0 ${theme.bg} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
            </div>

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${theme.iconBg} rounded-xl shadow-lg shadow-${color}-500/20`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(change)}%</span>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${theme.iconBg} transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.abs(change) * 3)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;