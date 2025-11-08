export default function TabNavigation({ activeTab, onTabChange, totalProducts, publishedCount, unpublishedCount }) {
    const tabs = [
        { id: 'all', label: 'All Products', count: totalProducts },
        { id: 'published', label: 'Published', count: publishedCount },
        { id: 'unpublished', label: 'Unpublished', count: unpublishedCount }
    ];

    return (
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {tab.label}
                    <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                            ? 'bg-purple-200 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}