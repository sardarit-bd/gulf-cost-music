import { Edit3, List, PlusCircle } from "lucide-react";

export default function MarketplaceTabs({
  activeMarketSection,
  setActiveMarketSection,
  isEditingListing,
  hasListing,
}) {
  return (
    <div className="flex flex-wrap border-b border-gray-200 mb-6">
      <button
        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${
          activeMarketSection === "create"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
        onClick={() => setActiveMarketSection("create")}
      >
        {isEditingListing ? (
          <>
            <Edit3 className="w-4 h-4" />
            Edit Listing
          </>
        ) : hasListing ? (
          <>
            <Edit3 className="w-4 h-4" />
            Edit Listing
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Create New Listing
          </>
        )}
      </button>

      <button
        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${
          activeMarketSection === "listings"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
        onClick={() => setActiveMarketSection("listings")}
      >
        <List className="w-4 h-4" />
        My Listing {hasListing && `(1)`}
      </button>
    </div>
  );
}
