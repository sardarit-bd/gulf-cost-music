export default function Tabs({
  activeTab,
  setActiveTab,
  isVerified = false,
  isProUser = false,
}) {
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "edit", label: "Edit Profile", icon: "✏️" },
  ];

  // Marketplace → only if verified
  if (isVerified) {
    tabs.push({ id: "marketplace", label: "Marketplace", icon: "🛒" });
  }

  // Billing → only if pro
  if (isProUser) {
    tabs.push({ id: "billing", label: "Billing", icon: "💰" });
  }

  return (
    <div className="flex border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? "text-white border-b-2 border-yellow-500 bg-gray-900/50"
              : "text-gray-400 hover:text-white hover:bg-gray-900/30"
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
