"use client";

import { Calendar, Newspaper, Music, Building2 } from "lucide-react";

const ProfileStats = ({ stats }) => {
  const statCards = [
    {
      icon: Calendar,
      label: "Total Events",
      value: stats.totalEvents,
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Newspaper,
      label: "Total News",
      value: stats.totalNews,
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Music,
      label: "Total Artists",
      value: stats.totalArtists,
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Building2,
      label: "Total Venues",
      value: stats.totalVenues,
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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

export default ProfileStats;
