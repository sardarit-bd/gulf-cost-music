"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ===============================
   INLINE API
================================ */
async function fetchMarketItems({
    API_BASE,
    search,
    sellerType,
    location,
    page = 1,
    limit = 12,
}) {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (sellerType && sellerType !== "all") params.set("sellerType", sellerType);
    if (location && location !== "all") params.set("location", location);

    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${API_BASE}/api/market?${params.toString()}`, {
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || "Failed to load market items");
    }

    return data; // { success, pagination, data }
}

export default function MarketPage() {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        limit: 12,
    });

    const [search, setSearch] = useState("");
    const [sellerType, setSellerType] = useState("all");
    const [location, setLocation] = useState("all");

    const loadItems = async (page = 1) => {
        try {
            setLoading(true);

            const res = await fetchMarketItems({
                API_BASE,
                search: search.trim(),
                sellerType,
                location,
                page,
                limit: pagination.limit,
            });

            setItems(res.data || []);
            setPagination(res.pagination || pagination);
        } catch (err) {
            toast.error(err.message || "Failed to load marketplace");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!API_BASE) return;
        loadItems(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_BASE]);

    return (
        <section className="min-h-screen mt-[90px] px-5 py-10 bg-gradient-to-br from-gray-950 to-black">
            <div className="container mx-auto space-y-8">
                {/* Header */}
                <div className="rounded-2xl border border-gray-700 bg-gradient-to-r from-gray-900 to-gray-950 p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <ShoppingBag className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-white text-3xl font-extrabold">Marketplace</h1>
                            <p className="text-gray-400">Browse items from verified sellers</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items..."
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                    />

                    <select
                        value={sellerType}
                        onChange={(e) => setSellerType(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                    >
                        <option value="all">All Sellers</option>
                        <option value="artist">Artist</option>
                        <option value="venue">Venue</option>
                        <option value="photographer">Photographer</option>
                    </select>

                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                    >
                        <option value="all">All Locations</option>
                        <option value="New Orleans">New Orleans</option>
                        <option value="Biloxi">Biloxi</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Pensacola">Pensacola</option>
                    </select>
                </div>

                <button
                    onClick={() => loadItems(1)}
                    className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600"
                >
                    Apply Filters
                </button>

                {/* Grid */}
                {loading ? (
                    <p className="text-gray-400">Loading items...</p>
                ) : items.length === 0 ? (
                    <p className="text-gray-400">No items found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <Link
                                key={item._id}
                                href={`/market/${item._id}`}
                                className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 block hover:border-yellow-500/40 transition"
                            >
                                <img
                                    src={item.photos?.[0] || "/placeholder.jpg"}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 space-y-2">
                                    <h3 className="text-white font-bold">{item.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {item.description}
                                    </p>
                                    <p className="text-yellow-400 font-bold">${item.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && pagination.pages > 1 && (
                    <div className="flex justify-center gap-4">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => loadItems(pagination.page - 1)}
                            className="px-4 py-2 border border-gray-700 text-white rounded-lg disabled:opacity-40"
                        >
                            Prev
                        </button>

                        <span className="text-gray-300">
                            Page {pagination.page} of {pagination.pages}
                        </span>

                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => loadItems(pagination.page + 1)}
                            className="px-4 py-2 border border-gray-700 text-white rounded-lg disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
