"use client";
import { ArrowLeft, Building, Camera, Filter, MapPin, Search, ShoppingBag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const sellerTypes = [
    { id: "all", label: "All", icon: ShoppingBag, color: "from-yellow-500 to-orange-500" },
    { id: "artist", label: "Artists", icon: Users, color: "from-purple-500 to-pink-500" },
    { id: "photographer", label: "Photographers", icon: Camera, color: "from-blue-500 to-cyan-500" },
    { id: "venue", label: "Venues", icon: Building, color: "from-green-500 to-emerald-500" },
    // Client requirement অনুযায়ী সব types
    { id: "studio", label: "Studios", icon: Building, color: "from-indigo-500 to-purple-500" },
    { id: "journalist", label: "Journalists", icon: Users, color: "from-pink-500 to-rose-500" },
    { id: "fan", label: "Fans", icon: Users, color: "from-gray-500 to-gray-700" },
];

// State configurations
const stateConfig = {
    "louisiana": { name: "Louisiana", color: "from-purple-500 to-blue-500", code: "LA" },
    "mississippi": { name: "Mississippi", color: "from-red-500 to-orange-500", code: "MS" },
    "alabama": { name: "Alabama", color: "from-green-500 to-emerald-500", code: "AL" },
    "florida": { name: "Florida", color: "from-yellow-500 to-orange-500", code: "FL" },
};

export default function StateMarketPage() {
    const { state } = useParams();
    const router = useRouter();
    const stateInfo = stateConfig[state?.toLowerCase()];

    // If state not in allowed list, redirect to main marketplace
    useEffect(() => {
        if (!stateInfo) {
            router.push('/markets');
        }
    }, [stateInfo, router]);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1,
    });

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (stateInfo) {
            fetchItems();
        }
    }, [state, selectedType, pagination.page, debouncedSearch]);

    const fetchItems = async () => {
        if (!stateInfo) return;

        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                location: stateInfo.name,
                ...(selectedType !== "all" && { sellerType: selectedType }),
                ...(debouncedSearch && { search: debouncedSearch }),
            });

            // Use state-specific API endpoint
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/state/${stateInfo.name}?${params}`
            );
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();

            if (data.success) {
                setItems(data.data || []);
                setPagination(data.pagination || {
                    page: 1,
                    limit: 12,
                    total: 0,
                    pages: 1,
                });
            } else {
                console.error("API error:", data.message);
                setItems([]);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchItems();
    };

    const handleClearFilters = () => {
        setSelectedType("all");
        setSearch("");
        setDebouncedSearch("");
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleTypeSelect = (typeId) => {
        setSelectedType(typeId);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    if (!stateInfo) {
        return null; // Will redirect in useEffect
    }

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse mb-6">
                        <div className={`w-24 h-24 mx-auto bg-gradient-to-r ${stateInfo.color}/20 rounded-full flex items-center justify-center`}>
                            <ShoppingBag className="text-yellow-500 animate-pulse" size={48} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Loading {stateInfo.name}</h2>
                    <p className="text-yellow-400/70 animate-pulse">Discovering amazing items...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-[97px]">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${stateInfo.color}/10 via-transparent to-transparent`}></div>
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    {/* Header */}
                    <div className="mb-8 mt-7">
                        <Link
                            href="/markets"
                            className="inline-flex items-center gap-2 border border-gray-600 p-2 rounded-lg text-yellow-400 hover:text-yellow-300 transition-colors group mb-3"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">All States</span>
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-center">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stateInfo.color} p-3 shadow-lg`}>
                                        <MapPin className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                                            {stateInfo.name}
                                            <span className="block text-xl md:text-2xl text-yellow-400 font-normal mt-2">
                                                Marketplace
                                            </span>
                                        </h1>
                                        <p className="text-gray-300 text-base sm:text-lg">
                                            {items.length} {items.length === 1 ? 'item' : 'items'} available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-8 border border-white/10 shadow-2xl">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 group-hover:text-yellow-300 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder={`What are you looking for in ${stateInfo.name}?`}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-6 sm:px-8 py-3 cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2"
                                >
                                    <Search size={20} />
                                    <span className="hidden sm:inline">Search</span>
                                </button>
                            </div>
                        </form>

                        {/* Quick Filter Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Filter size={18} />
                                    Quick Filters
                                </h3>
                                <button
                                    onClick={handleClearFilters}
                                    className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 bg-white/10 rounded-lg"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {sellerTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleTypeSelect(type.id)}
                                        className={`group relative overflow-hidden rounded-xl px-4 py-3 transition-all duration-300 transform hover:-translate-y-1 min-w-[100px] ${selectedType === type.id
                                            ? "ring-2 ring-yellow-400 shadow-lg"
                                            : "hover:bg-white/5"
                                            }`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${selectedType === type.id ? 'opacity-20' : ''}`}></div>
                                        <div className="relative z-10">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-2 rounded-lg ${selectedType === type.id ? 'bg-white' : 'bg-white/10'}`}>
                                                    <type.icon
                                                        size={16}
                                                        className={selectedType === type.id ? 'text-black' : 'text-white'}
                                                    />
                                                </div>
                                                <span className={`text-xs sm:text-sm font-medium ${selectedType === type.id ? 'text-white' : 'text-gray-300'}`}>
                                                    {type.label}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Grid Section */}
            <div className="container mx-auto px-4 sm:px-6 pb-16">
                {items.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
                        <div className="max-w-md mx-auto">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-800/50 to-gray-900/50 flex items-center justify-center border border-white/10">
                                <ShoppingBag className="text-gray-400" size={56} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No Items Found</h3>
                            <p className="text-gray-300 mb-8">
                                We couldn't find any items in {stateInfo.name} matching your criteria.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:-translate-y-0.5"
                                >
                                    Clear Filters
                                </button>
                                <Link
                                    href="/markets"
                                    className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20 transform hover:-translate-y-0.5"
                                >
                                    Browse All States
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">Showing</p>
                                    <p className="text-2xl font-bold text-white">{items.length} items</p>
                                </div>
                                <div className="hidden md:block w-px h-8 bg-white/10"></div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">Filter</p>
                                    <p className="text-xl font-bold text-yellow-400">
                                        {selectedType === "all" ? "All Types" : sellerTypes.find(t => t.id === selectedType)?.label}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <p className="text-gray-400">
                                    Page <span className="font-bold text-white">{pagination.page}</span> of{" "}
                                    <span className="font-bold text-white">{pagination.pages}</span>
                                </p>
                            </div>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {items.map((item) => (
                                <MarketItemCard 
                                    key={item._id} 
                                    item={item} 
                                    state={state}
                                    stateInfo={stateInfo}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                        disabled={pagination.page === 1}
                                        className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                    >
                                        <ArrowLeft size={16} />
                                        Previous
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                                            let pageNum;
                                            if (pagination.pages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.pages - 2) {
                                                pageNum = pagination.pages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${pagination.page === pageNum
                                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg"
                                                        : "bg-white/5 text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                        disabled={pagination.page === pagination.pages}
                                        className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                    >
                                        Next
                                        <ArrowLeft size={16} className="rotate-180" />
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

// Separate component for Market Item Card with fullscreen image
function MarketItemCard({ item, state, stateInfo }) {
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openFullscreenImage = (index) => {
        setSelectedImageIndex(index);
        setIsImageOpen(true);
    };

    const closeFullscreenImage = () => {
        setIsImageOpen(false);
    };

    const goToNextImage = () => {
        if (item.photos && item.photos.length > 0) {
            setSelectedImageIndex((prev) => (prev + 1) % item.photos.length);
        }
    };

    const goToPrevImage = () => {
        if (item.photos && item.photos.length > 0) {
            setSelectedImageIndex((prev) => (prev - 1 + item.photos.length) % item.photos.length);
        }
    };

    return (
        <>
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10">
                {/* Item Photo */}
                <div className="relative h-64 overflow-hidden">
                    {item.photos?.[0] ? (
                        <>
                            <Image
                                src={item.photos[0]}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                onClick={() => openFullscreenImage(0)}
                            />
                            <button
                                onClick={() => openFullscreenImage(0)}
                                className="absolute inset-0 w-full h-full bg-transparent"
                                aria-label="View image fullscreen"
                            />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <ShoppingBag size={48} className="text-gray-400" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20 capitalize">
                            {item.sellerType}
                        </span>
                        <span className={`px-3 py-1.5 backdrop-blur-sm text-xs font-bold rounded-full border ${item.status === "active"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}>
                            {item.status}
                        </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4">
                        <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
                            <span className="font-bold text-black text-sm">${item.price}</span>
                        </div>
                    </div>

                    {/* Photo Count */}
                    {item.photos && item.photos.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
                                <span className="text-white text-xs font-medium">
                                    +{item.photos.length - 1} more
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Item Info */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                        {item.title}
                    </h3>

                    {/* Seller Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                {item.seller?.name?.charAt(0) || "S"}
                            </div>
                            {item.seller?.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                    <div className="text-[10px] text-white">✓</div>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-white text-sm">{item.seller?.name}</p>
                            <p className="text-xs text-gray-400">Seller</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <MapPin size={16} className="text-yellow-400" />
                        <span className="text-sm truncate">
                            {item.location && `${item.location}, `}{stateInfo.name}
                        </span>
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                        {item.description}
                    </p>

                    {/* Fee Info */}
                    {item.feeInfo && (
                        <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-yellow-300">Platform Fee:</span>
                                <span className="text-yellow-400 font-semibold">
                                    {item.feeInfo.percentage}% (${item.feeInfo.amount.toFixed(2)})
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-300">Total Price:</span>
                                <span className="text-white font-bold">${item.feeInfo.total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <Link
                        href={`/markets/${state}/${item._id}`}
                        className="block w-full text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-2 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-yellow-500/25"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {isImageOpen && item.photos && item.photos[selectedImageIndex] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg">
                    <button
                        onClick={closeFullscreenImage}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-yellow-400 transition-colors z-10 p-2 bg-black/50 rounded-full"
                        aria-label="Close fullscreen"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {item.photos.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevImage}
                                className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors z-10 p-2 bg-black/50 rounded-full"
                                aria-label="Previous image"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={goToNextImage}
                                className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors z-10 p-2 bg-black/50 rounded-full"
                                aria-label="Next image"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    <div className="relative w-full h-full max-w-7xl mx-auto p-4">
                        <div className="relative w-full h-full">
                            <Image
                                src={item.photos[selectedImageIndex]}
                                alt={`${item.title} - Image ${selectedImageIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-sm">
                                {selectedImageIndex + 1} / {item.photos.length}
                            </span>
                        </div>

                        {/* Image Info */}
                        <div className="absolute bottom-4 left-4 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg max-w-md">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-gray-300">By {item.seller?.name}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}