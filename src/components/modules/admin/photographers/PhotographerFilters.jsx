import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

export default function PhotographerFilters({ filters, onChange }) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const clearFilters = () => {
        onChange("search", "");
        onChange("status", "all");
        onChange("plan", "all");
    };

    const hasActiveFilters = filters.search || filters.status !== "all" || filters.plan !== "all";

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        className="pl-9 w-full border border-gray-300 rounded-lg py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-500"
                        placeholder="Search by name, city, or email..."
                        value={filters.search}
                        onChange={(e) => onChange("search", e.target.value)}
                    />
                    {filters.search && (
                        <button
                            onClick={() => onChange("search", "")}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`text-gray-500 px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 ${showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                    <Filter size={16} />
                    Advanced
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <X size={16} />
                        Clear
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-300">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            className="text-gray-500 w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={filters.status}
                            onChange={(e) => onChange("status", e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Plan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subscription Plan
                        </label>
                        <select
                            className="text-gray-500 w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={filters.plan}
                            onChange={(e) => onChange("plan", e.target.value)}
                        >
                            <option value="all">All Plans</option>
                            <option value="pro">Pro Plan</option>
                            <option value="free">Free Plan</option>
                        </select>
                    </div>

                    {/* City Filter (Optional - if you want to add) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort By
                        </label>
                        <select
                            className="text-gray-500 w-full border border-gray-300 rounded-lg py-2.5 px-3"
                            value={filters.sort || "newest"}
                            onChange={(e) => onChange("sort", e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                        </select>
                    </div>

                    {/* Verification Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification
                        </label>
                        <select
                            className="text-gray-500 w-full border border-gray-300 rounded-lg py-2.5 px-3"
                            value={filters.verified || "all"}
                            onChange={(e) => onChange("verified", e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Active Filters Badges */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            Search: {filters.search}
                            <button onClick={() => onChange("search", "")}>
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {filters.status !== "all" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Status: {filters.status}
                            <button onClick={() => onChange("status", "all")}>
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {filters.plan !== "all" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                            Plan: {filters.plan}
                            <button onClick={() => onChange("plan", "all")}>
                                <X size={12} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}