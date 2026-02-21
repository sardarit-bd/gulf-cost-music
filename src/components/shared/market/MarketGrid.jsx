// components/market/MarketGrid.jsx
"use client";

import { Grid, List, Store } from "lucide-react";
import { useState } from "react";
import MarketCard from "./MarketCard";

export default function MarketGrid({ items = [], userType = "all", currentUser, userListing, onListingUpdate, pagination }) {
    const [viewMode, setViewMode] = useState("grid");

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No items found in {userType === "all" ? "marketplace" : `${userType} marketplace`}
                </h3>
                <p className="text-gray-600">
                    Try adjusting your filters or check back later
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                    Showing {items.length} of {pagination?.total || items.length} items
                </p>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : "text-gray-600"}`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : "text-gray-600"}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Items Display */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <MarketCard
                            key={item._id}
                            item={item}
                            userType={userType}
                            currentUser={currentUser}
                            isOwnListing={userListing?._id === item._id}
                            onItemUpdate={onListingUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <MarketCard
                            key={item._id}
                            item={item}
                            userType={userType}
                            currentUser={currentUser}
                            isOwnListing={userListing?._id === item._id}
                            viewMode="list"
                            onItemUpdate={onListingUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}