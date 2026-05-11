"use client";
import { Crown, Users } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, plan }) => {
    const colorClasses = {
        purple: "from-purple-500 to-pink-600",
        green: "from-green-500 to-emerald-600",
        orange: "from-orange-500 to-red-600",
        blue: "from-blue-500 to-cyan-600",
        yellow: "from-yellow-500 to-amber-600",
        indigo: "from-indigo-500 to-purple-600",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value || 0}</h3>
                    {plan && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${plan === "pro"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                            }`}>
                            {plan === "pro" ? (
                                <>
                                    <Crown className="w-3 h-3 mr-1" />
                                    Pro Plan
                                </>
                            ) : (
                                <>
                                    <Users className="w-3 h-3 mr-1" />
                                    Free Plan
                                </>
                            )}
                        </span>
                    )}
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color] || "from-gray-500 to-gray-600"}`}>
                    {plan === "pro" ? (
                        <Crown className="w-5 h-5 text-white" />
                    ) : plan === "free" ? (
                        <Users className="w-5 h-5 text-white" />
                    ) : (
                        <Icon className="w-5 h-5 text-white" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;