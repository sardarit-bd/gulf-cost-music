import { Edit3, List, PlusCircle } from "lucide-react";

export default function MarketplaceTabs({
    activeTab,
    setActiveTab,
    existingItem
}) {
    return (
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl">
            <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === "create"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                onClick={() => setActiveTab("create")}
            >
                {existingItem ? (
                    <>
                        <Edit3 className="w-5 h-5" />
                        Edit Listing
                    </>
                ) : (
                    <>
                        <PlusCircle className="w-5 h-5" />
                        Create Listing
                    </>
                )}
            </button>

            <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === "listings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                onClick={() => setActiveTab("listings")}
            >
                <List className="w-5 h-5" />
                My Listing {existingItem && <span className="ml-1">(1)</span>}
            </button>
        </div>
    );
}