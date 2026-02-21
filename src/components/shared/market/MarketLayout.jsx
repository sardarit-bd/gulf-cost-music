// components/market/MarketLayout.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useSession } from "@/lib/auth";
import { api } from "./api";
import MarketFilters from "./MarketFilters";
import MarketGrid from "./MarketGrid";
import MarketHeader from "./MarketHeader";
import MarketPagination from "./MarketPagination";

export default function MarketLayout({ userType = "all" }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useSession();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userListing, setUserListing] = useState(null);
    const [userListingLoading, setUserListingLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });

    const [filters, setFilters] = useState({
        sellerType: userType !== "all" ? userType : searchParams.get("sellerType") || "",
        location: searchParams.get("location") || "",
        search: searchParams.get("search") || "",
        sort: searchParams.get("sort") || "newest",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || ""
    });

    useEffect(() => {
        fetchItems();
    }, [filters, pagination.page]);

    useEffect(() => {
        if (user) {
            fetchUserListing();
        } else {
            setUserListing(null);
        }
    }, [user]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.sellerType && { sellerType: filters.sellerType }),
                ...(filters.location && { location: filters.location }),
                ...(filters.search && { search: filters.search }),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.minPrice && { minPrice: filters.minPrice }),
                ...(filters.maxPrice && { maxPrice: filters.maxPrice })
            });

            const response = await api.get(`/api/market?${queryParams}`);
            setItems(response.data || []);
            setPagination(response.pagination || {
                page: 1,
                limit: 12,
                total: 0,
                pages: 0
            });
        } catch (error) {
            console.error("Error fetching market items:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserListing = async () => {
        if (!user) return;

        setUserListingLoading(true);
        try {
            const response = await api.get("/api/market/me");
            setUserListing(response.data);
        } catch (error) {
            console.error("Error fetching user listing:", error);
            setUserListing(null);
        } finally {
            setUserListingLoading(false);
        }
    };

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 }));

        // Update URL
        const params = new URLSearchParams(searchParams);
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <MarketHeader
                userType={userType}
                totalItems={pagination.total}
                userListing={userListing}
                userListingLoading={userListingLoading}
                onListingUpdate={fetchUserListing}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MarketFilters
                    filters={filters}
                    onFilterChange={updateFilters}
                    userType={userType}
                />

                {loading ? (
                    <LoadingSpinner message={`Loading ${userType === "all" ? "marketplace" : `${userType} marketplace`}...`} />
                ) : (
                    <>
                        <MarketGrid
                            items={items}
                            userType={userType}
                            currentUser={user}
                            userListing={userListing}
                            onListingUpdate={fetchUserListing}
                            pagination={pagination}
                        />

                        {pagination.pages > 1 && (
                            <MarketPagination
                                pagination={pagination}
                                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}