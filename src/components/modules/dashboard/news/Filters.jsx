"use client";
import { Filter, Search, X } from "lucide-react";

const Filters = ({
    search,
    statusFilter,
    locationFilter,
    locations,
    onSearchChange,
    onStatusFilterChange,
    onLocationFilterChange,
    onApply,
    onClear
}) => {
    const hasActiveFilters = search || statusFilter !== "all" || locationFilter;

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search News
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by title, description, or location..."
                            className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <select
                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            value={locationFilter}
                            onChange={(e) => onLocationFilterChange(e.target.value)}
                        >
                            <option value="">All Locations</option>
                            {locations.map(location => (
                                <option key={location} value={location}>
                                    {location.charAt(0).toUpperCase() + location.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex space-x-2 self-end">
                        <button
                            onClick={onApply}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center space-x-2"
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
        </div>
    );
};

export default Filters;