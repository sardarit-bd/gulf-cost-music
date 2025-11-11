"use client";
import { X as CloseIcon, Filter, Search } from "lucide-react";

const Filters = ({
    search,
    userType,
    verified,
    onSearchChange,
    onUserTypeChange,
    onVerifiedChange,
    onApply,
    onClear,
    hasActiveFilters
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    {hasActiveFilters && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Active Filters
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <CloseIcon className="w-4 h-4" />
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Users
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Type
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={userType}
                        onChange={(e) => onUserTypeChange(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="artist">Artist</option>
                        <option value="venue">Venue</option>
                        <option value="admin">Admin</option>
                        <option value="journalist">Journalist</option>
                        <option value="user">Regular User</option>
                    </select>
                </div>

                <div className="w-full lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Status
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={verified}
                        onChange={(e) => onVerifiedChange(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                    </select>
                </div>

                <button
                    onClick={onApply}
                    className="w-full lg:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                    Apply Filters
                </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {search && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Search: "{search}"
                            <button
                                onClick={() => onSearchChange("")}
                                className="ml-1 hover:text-blue-600"
                            >
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {userType !== "all" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Type: {userType}
                            <button
                                onClick={() => onUserTypeChange("all")}
                                className="ml-1 hover:text-green-600"
                            >
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {verified !== "" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            Status: {verified === "true" ? "Verified" : "Unverified"}
                            <button
                                onClick={() => onVerifiedChange("")}
                                className="ml-1 hover:text-purple-600"
                            >
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Filters;