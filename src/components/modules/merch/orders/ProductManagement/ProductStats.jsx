"use client";
import { Package, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

const ProductStats = ({ stats }) => {
    const statCards = [
        { icon: Package, label: "Total Products", value: stats.total, color: "from-purple-500 to-pink-600" },
        { icon: CheckCircle, label: "Active", value: stats.active, color: "from-green-500 to-emerald-600" },
        { icon: XCircle, label: "Inactive", value: stats.inactive, color: "from-yellow-500 to-amber-600" },
        { icon: AlertCircle, label: "Out of Stock", value: stats.outOfStock, color: "from-red-500 to-rose-600" },
        { icon: TrendingUp, label: "In Stock", value: stats.inStock, color: "from-blue-500 to-cyan-600" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {statCards.map((card, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-medium mb-1">{card.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
                            <card.icon className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductStats;