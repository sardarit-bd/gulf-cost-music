"use client";

import { MapPin, Search, SlidersHorizontal, User } from "lucide-react";

export default function MarketFilters({
    search,
    setSearch,
    sellerType,
    setSellerType,
    location,
    setLocation,
    onApply,
    onReset,
}) {
    const locations = ["all", "New Orleans", "Biloxi", "Mobile", "Pensacola", "Other"];
    const sellerTypes = ["all", "artist", "venue", "photographer"];

    return (
        <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950 p-5">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
                <SlidersHorizontal size={18} className="text-yellow-400" />
                Filters
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-6">
                    <label className="text-gray-300 text-sm mb-2 block">Search</label>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-3 py-3 text-white outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                        />
                    </div>
                </div>

                {/* Seller Type */}
                <div className="md:col-span-3">
                    <label className="text-gray-300 text-sm mb-2 block">Seller Type</label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={sellerType}
                            onChange={(e) => setSellerType(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-3 py-3 text-white outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                        >
                            {sellerTypes.map((t) => (
                                <option key={t} value={t} className="bg-gray-900">
                                    {t === "all" ? "All" : t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div className="md:col-span-3">
                    <label className="text-gray-300 text-sm mb-2 block">Location</label>
                    <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-3 py-3 text-white outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                        >
                            {locations.map((l) => (
                                <option key={l} value={l} className="bg-gray-900">
                                    {l === "all" ? "All" : l}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-5">
                <button
                    type="button"
                    onClick={onReset}
                    className="px-5 py-2.5 rounded-xl border border-gray-600 text-gray-200 hover:bg-gray-800 transition"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onApply}
                    className="px-6 py-2.5 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
