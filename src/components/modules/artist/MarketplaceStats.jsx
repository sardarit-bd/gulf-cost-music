"use client";

import { CreditCard, Eye, TrendingUp, Users } from "lucide-react";

export default function MarketplaceStats({ stats }) {
    const statItems = [
        {
            icon: Eye,
            label: "Views",
            value: stats?.views || 0,
            change: "+12%",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            icon: Users,
            label: "Clicks",
            value: stats?.clicks || 0,
            change: "+8%",
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            icon: TrendingUp,
            label: "Inquiries",
            value: stats?.inquiries || 0,
            change: "+5%",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            icon: CreditCard,
            label: "Conversion",
            value: stats?.conversion || "0%",
            change: "+2%",
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
    ];

    return (
        <div className="flex flex-wrap gap-4 mt-6">
            {statItems.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">{item.value}</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                {item.change}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}