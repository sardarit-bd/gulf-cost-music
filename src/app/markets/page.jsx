"use client";
import { Building, Camera, MapPin, Search, ShoppingBag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// States based on client requirement
const states = [
    { name: "Louisiana", code: "LA", color: "from-purple-500 to-blue-500" },
    { name: "Mississippi", code: "MS", color: "from-red-500 to-orange-500" },
    { name: "Alabama", code: "AL", color: "from-green-500 to-emerald-500" },
    { name: "Florida", code: "FL", color: "from-yellow-500 to-orange-500" },
];

const sellerTypes = [
    { id: "all", label: "All", icon: ShoppingBag },
    { id: "artist", label: "Artists", icon: Users },
    { id: "photographer", label: "Photographers", icon: Camera },
    { id: "venue", label: "Venues", icon: Building },
];

export default function MarketPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedState, setSelectedState] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1,
    });

    useEffect(() => {
        fetchItems();
    }, [selectedType, selectedState, pagination.page]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(selectedType !== "all" && { sellerType: selectedType }),
                ...(selectedState && { location: selectedState }),
                ...(search && { search }),
            });

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market?${params}`
            );
            const data = await res.json();

            if (data.success) {
                setItems(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchItems();
    };

    const handleStateClick = (stateName) => {
        setSelectedState(stateName);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-yellow-400">Loading marketplace...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-14 mt-20 px-6 min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Gulf Coast Marketplace
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover artwork, photography services, and venues from talented creators across the Gulf Coast
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="flex-1 w-full md:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search items, services, or artists..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* State Filter */}
                        <div className="flex gap-2 items-center">
                            <MapPin className="text-gray-400" size={20} />
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">All States</option>
                                {states.map((state) => (
                                    <option key={state.name} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
                        >
                            Search
                        </button>
                    </div>

                    {/* Seller Type Filter */}
                    <div className="mt-6 flex gap-2 flex-wrap justify-center">
                        {sellerTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setSelectedType(type.id);
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${selectedType === type.id
                                    ? "bg-yellow-500 text-black"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                            >
                                <type.icon size={18} />
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* State Quick Links */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Browse by State</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {states.map((state) => (
                            <Link
                                key={state.name}
                                href={`/markets/${state.name.toLowerCase()}`}
                                onClick={() => handleStateClick(state.name)}
                                className={`group relative overflow-hidden rounded-xl p-6 ${state.color} bg-gradient-to-br transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-2">{state.name}</h3>
                                    <p className="text-white/80 text-sm">Browse items from {state.name}</p>
                                    <div className="mt-4 flex items-center text-white/90">
                                        <span className="text-sm">Explore →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-300">
                        Showing <span className="font-semibold text-white">{items.length}</span> of{" "}
                        <span className="font-semibold text-white">{pagination.total}</span> items
                        {selectedState && ` in ${selectedState}`}
                    </p>
                    <p className="text-gray-400 text-sm">
                        Page {pagination.page} of {pagination.pages}
                    </p>
                </div>

                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Items Found</h3>
                        <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={() => {
                                setSelectedType("all");
                                setSelectedState("");
                                setSearch("");
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-[var(--card)] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                                >
                                    {/* Item Photo */}
                                    <div className="relative w-full h-64 overflow-hidden">
                                        {item.photos?.[0] ? (
                                            <Image
                                                src={item.photos[0]}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                <ShoppingBag size={48} className="text-gray-400" />
                                            </div>
                                        )}

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full capitalize">
                                                {item.sellerType}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.status === "active" ? "bg-green-500/20 text-green-400" :
                                                item.status === "sold" ? "bg-red-500/20 text-red-400" :
                                                    "bg-gray-500/20 text-gray-400"
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                            <span className="text-white text-sm font-medium">
                                                {item.photos?.length || 0} photos
                                            </span>
                                            <span className="text-white text-sm font-medium">
                                                ${item.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Item Info */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-white line-clamp-1">{item.title}</h3>
                                        </div>

                                        {/* Seller Info */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                {item.seller?.name?.charAt(0) || "S"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-text-white text-sm">{item.seller?.name}</p>
                                                {item.seller?.isVerified && (
                                                    <span className="text-xs text-green-600">✓ Verified</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {item.location && (
                                            <div className="flex items-center gap-1 text-text-white mb-3">
                                                <MapPin size={16} />
                                                <span className="text-sm truncate">{item.location}</span>
                                            </div>
                                        )}

                                        {/* Description Preview */}
                                        <p className="text-white text-sm line-clamp-2 mb-4">
                                            {item.description}
                                        </p>

                                        {/* Fee Info (Client Requirement) */}
                                        {item.feeInfo && (
                                            <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white">Fee ({item.feeInfo.percentage}%):</span>
                                                    <span className="font-semibold">${item.feeInfo.amount.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm mt-1">
                                                    <span className="text-text-white">Total:</span>
                                                    <span className="font-bold">${item.feeInfo.total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <Link
                                            href={`/markets/${item.location.toLowerCase() || 'all'}/${item._id}`}
                                            className="w-full bg-yellow-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-yellow-400 transition block"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(pagination.pages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                                            className={`px-4 py-2 rounded-lg ${pagination.page === i + 1
                                                ? "bg-yellow-500 text-black"
                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                        disabled={pagination.page === pagination.pages}
                                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}