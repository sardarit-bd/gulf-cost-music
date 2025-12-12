export default function Tabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "edit", label: "Edit Profile" },
    ];

    return (
        <div className="border-b border-gray-700 bg-gray-900">
            <div className="flex overflow-x-auto">
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === id
                                ? "text-yellow-400 border-b-2 border-yellow-400 bg-gray-800"
                                : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800/50"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}