"use client";

import {
  CreditCard,
  LayoutDashboard,
  Pencil,
  Store,
} from "lucide-react";

export default function Tabs({
  activeTab,
  setActiveTab,
  isVerified = false,
}) {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "edit",
      label: "Edit Profile",
      icon: Pencil,
    },
  ];

  if (isVerified) {
    tabs.push({
      id: "marketplace",
      label: "Marketplace",
      icon: Store,
    });
  }

  tabs.push({
    id: "billing",
    label: "Billing",
    icon: CreditCard,
  });

  return (
    <div className="flex border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all
              ${activeTab === tab.id
                ? "text-white border-b-2 border-yellow-500 bg-gray-900/50"
                : "text-gray-400 hover:text-white hover:bg-gray-900/30"
              }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
