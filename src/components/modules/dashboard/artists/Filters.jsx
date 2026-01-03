"use client";
import { Filter, Search, X } from "lucide-react";

const Filters = ({
    search,
    statusFilter,
    planFilter,
    onSearchChange,
    onStatusFilterChange,
    onPlanFilterChange,
    onApply,
    onClear
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Artists
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by artist name, genre, or city..."
                            className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

                <div className="w-full lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="w-full lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subscription Plan
                    </label>
                    <select
                        className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={planFilter}
                        onChange={(e) => onPlanFilterChange(e.target.value)}
                    >
                        <option value="all">All Plans</option>
                        <option value="pro">Pro Plan</option>
                        <option value="free">Free Plan</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={onApply}
                        className="w-full lg:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Apply</span>
                    </button>
                    {(search || statusFilter !== "all" || planFilter !== "all") && (
                        <button
                            onClick={onClear}
                            className="w-full lg:w-auto px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors flex items-center space-x-2"
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