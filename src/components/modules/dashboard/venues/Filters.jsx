"use client";

import { Filter, Search, X } from "lucide-react";

const Filters = ({
    search,
    statusFilter,
    cityFilter,
    planFilter,
    cities,
    onSearchChange,
    onStatusFilterChange,
    onCityFilterChange,
    onPlanFilterChange,
    onApply,
    onClear,
}) => {
    const hasActiveFilters = search || statusFilter !== "all" || cityFilter || planFilter !== "all";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Venues
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by venue name, city, or address..."
                            className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onApply()}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={cityFilter}
                        onChange={(e) => onCityFilterChange(e.target.value)}
                    >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plan
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={planFilter}
                        onChange={(e) => onPlanFilterChange(e.target.value)}
                    >
                        <option value="all">All Plans</option>
                        <option value="pro">Pro</option>
                        <option value="free">Free</option>
                    </select>
                </div>

                <div className="flex space-x-2 self-end">
                    <button
                        onClick={onApply}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 font-medium transition-colors flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Apply</span>
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors flex items-center space-x-2"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Filters;