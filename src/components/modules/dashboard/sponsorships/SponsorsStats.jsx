"use client";

import { Building2, CheckCircle, ImageIcon } from "lucide-react";

const SponsorsStats = ({ stats }) => {
  const statCards = [
    {
      icon: Building2,
      label: "Total Sponsors",
      value: stats.total,
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: CheckCircle,
      label: "Active",
      value: stats.active,
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: ImageIcon,
      label: "With Logo",
      value: stats.withLogo,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                {card.label}
              </p>
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

export default SponsorsStats;
