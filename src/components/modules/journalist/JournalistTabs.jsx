// components/journalist/JournalistTabs.js
import { FileText, Newspaper, User } from "lucide-react";

export default function JournalistTabs({
  activeTab,
  setActiveTab,
  editingNews,
}) {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="flex overflow-x-auto">
        {[
          { id: "news", label: "My News", icon: Newspaper },
          { id: "profile", label: "Profile", icon: User },
          {
            id: "edit",
            label: editingNews ? "Edit News" : "Create News",
            icon: FileText,
          },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
              activeTab === id
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
