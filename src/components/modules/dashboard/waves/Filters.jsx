"use client";
import { Filter, Search } from "lucide-react";

const Filters = ({
    searchTerm,
    onSearchChange,
    onApply
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Sessions
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by session title..."
                            className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={onApply}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2 justify-center text-sm sm:text-base"
                >
                    <Filter className="w-4 h-4" />
                    <span>Apply Filters</span>
                </button>
            </div>
        </div>
    );
};

export default Filters;