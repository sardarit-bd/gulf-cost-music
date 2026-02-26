// components/market/MarketFilters.jsx
"use client";

import { useState } from "react";
import { Search, MapPin, Filter, X, SlidersHorizontal, DollarSign } from "lucide-react";
import Select from "@/ui/Select";

const locationOptions = [
    { value: "", label: "All Locations" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Alabama", label: "Alabama" },
    { value: "Florida", label: "Florida" }
];

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" }
];

const sellerTypeOptions = {
    all: [
        { value: "", label: "All Sellers" },
        { value: "artist", label: "Artists" },
        { value: "venue", label: "Venues" },
        { value: "photographer", label: "Photographers" },
        { value: "studio", label: "Studios" },
        { value: "journalist", label: "Journalists" },
        { value: "fan", label: "Fans" }
    ],
    artist: [{ value: "artist", label: "Artists" }],
    venue: [{ value: "venue", label: "Venues" }],
    photographer: [{ value: "photographer", label: "Photographers" }],
    studio: [{ value: "studio", label: "Studios" }],
    journalist: [{ value: "journalist", label: "Journalists" }],
    fan: [{ value: "fan", label: "Fans" }]
};

export default function MarketFilters({ filters, onFilterChange, userType = "all" }) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [priceRange, setPriceRange] = useState({
        min: filters.minPrice || "",
        max: filters.maxPrice || ""
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange({ search: searchInput });
    };

    const handlePriceApply = () => {
        onFilterChange({
            minPrice: priceRange.min,
            maxPrice: priceRange.max
        });
    };

    const clearFilters = () => {
        setSearchInput("");
        setPriceRange({ min: "", max: "" });
        onFilterChange({
            sellerType: userType !== "all" ? userType : "",
            location: "",
            search: "",
            sort: "newest",
            minPrice: "",
            maxPrice: ""
        });
    };

    const hasActiveFilters = filters.sellerType || filters.location || filters.search || filters.minPrice || filters.maxPrice;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={`Search in ${userType === "all" ? "marketplace" : `${userType} marketplace`}...`}
                        className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Seller Type Filter - Only show for 'all' */}
                {userType === "all" && (
                    <div className="flex-1 min-w-[200px]">
                        <Select
                            label=""
                            value={filters.sellerType}
                            onChange={(e) => onFilterChange({ sellerType: e.target.value })}
                            options={sellerTypeOptions.all}
                            placeholder="Seller Type"
                            className="w-full"
                        />
                    </div>
                )}

                {/* Location Filter */}
                <div className="flex-1 min-w-[200px]">
                    <Select
                        label=""
                        value={filters.location}
                        onChange={(e) => onFilterChange({ location: e.target.value })}
                        options={locationOptions}
                        placeholder="Location"
                        className="w-full"
                        icon={<MapPin className="w-4 h-4" />}
                    />
                </div>

                {/* Sort Filter */}
                <div className="flex-1 min-w-[200px]">
                    <Select
                        label=""
                        value={filters.sort}
                        onChange={(e) => onFilterChange({ sort: e.target.value })}
                        options={sortOptions}
                        placeholder="Sort by"
                        className="w-full"
                    />
                </div>

                {/* Filter Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Price
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters - Price Range */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Price ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    placeholder="0"
                                    min="0"
                                    className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    placeholder="1000"
                                    min="0"
                                    className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handlePriceApply}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}