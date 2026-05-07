"use client";
import { Package, CheckCircle, XCircle, DollarSign, Clock, TrendingUp } from "lucide-react";

const OrderStats = ({ stats }) => {
  const statCards = [
    { icon: Package, label: "Total Orders", value: stats.total, color: "from-blue-500 to-cyan-600" },
    { icon: Clock, label: "Pending", value: stats.pending, color: "from-yellow-500 to-amber-600" },
    { icon: CheckCircle, label: "Delivered", value: stats.delivered, color: "from-green-500 to-emerald-600" },
    { icon: DollarSign, label: "Paid", value: stats.paid, color: "from-emerald-500 to-teal-600" },
    { icon: XCircle, label: "Cancelled", value: stats.cancelled, color: "from-red-500 to-rose-600" },
    { icon: TrendingUp, label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {statCards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-0.5">{card.label}</p>
              <h3 className="text-xl font-bold text-gray-900">{card.value}</h3>
            </div>
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${card.color}`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;