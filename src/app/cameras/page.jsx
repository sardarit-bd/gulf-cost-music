"use client";
import { Camera, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PhotographersPage() {
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All");

    // PDF REQUIREMENT: 4 states only - with ACRONYMS
    const states = [
        { value: "All", label: "All States" },
        { value: "LA", label: "Louisiana" },
        { value: "MS", label: "Mississippi" },
        { value: "AL", label: "Alabama" },
        { value: "FL", label: "Florida" }
    ];

    // Cities for filtering (matching new mapping)
    const cities = [
        { value: "All", label: "All Cities" },
        { value: "new orleans", label: "New Orleans" },
        { value: "biloxi", label: "Biloxi" },
        { value: "mobile", label: "Mobile" },
        { value: "pensacola", label: "Pensacola" }
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/photographers`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setPhotographers(data.data.photographers);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Filter photographers
    const filteredPhotographers = photographers.filter((p) => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.biography?.toLowerCase().includes(searchTerm.toLowerCase());

        // STATE-BASED FILTERING with acronyms
        const matchesState = selectedState === "All" || p.state === selectedState;

        // CITY FILTERING
        const matchesCity = selectedCity === "All" || p.city === selectedCity.toLowerCase();

        return matchesSearch && matchesState && matchesCity;
    });

    // Group photographers by state for stats
    const stateStats = states.reduce((acc, state) => {
        if (state.value !== "All") {
            acc[state.value] = photographers.filter(p => p.state === state.value).length;
        }
        return acc;
    }, {});

    // Group photographers by city for stats
    const cityStats = cities.reduce((acc, city) => {
        if (city.value !== "All") {
            acc[city.value] = photographers.filter(p => p.city === city.value).length;
        }
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-yellow-400">
                <div className="text-center">
                    <Camera size={48} className="mx-auto mb-4 animate-pulse" />
                    <p>Loading photographers...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-14 mt-20 px-6 min-h-screen">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Gulf Coast Photographers
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover talented photographers across Louisiana, Mississippi, Alabama & Florida
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search photographers by name or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* State Filter - Using acronyms */}
                    <div className="mb-4">
                        <p className="text-gray-300 mb-3 font-medium">Filter by State:</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {states.map((state) => (
                                <button
                                    key={state.value}
                                    onClick={() => setSelectedState(state.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${selectedState === state.value
                                        ? "bg-yellow-500 text-black"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    {state.value !== "All" ? `${state.label} (${state.value})` : state.label}
                                    {state.value !== "All" && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedState === state.value ? "bg-black/20" : "bg-white/10"}`}>
                                            {stateStats[state.value] || 0}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City Filter */}
                    <div>
                        <p className="text-gray-300 mb-3 font-medium">Filter by City:</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {cities.map((city) => (
                                <button
                                    key={city.value}
                                    onClick={() => setSelectedCity(city.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${selectedCity === city.value
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    {city.label}
                                    {city.value !== "All" && (
                                        <span className={`text-xs px-1 py-0.5 rounded-full ${selectedCity === city.value ? "bg-white/20" : "bg-white/10"}`}>
                                            {cityStats[city.value] || 0}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats and Breadcrumbs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <p className="text-gray-300 text-sm mb-1">Gulf Coast Photographers</p>
                        <h2 className="text-2xl font-bold text-white">
                            {selectedState === "All" && selectedCity === "All"
                                ? "All Photographers"
                                : `${selectedState !== "All" ? states.find(s => s.value === selectedState)?.label : ""} ${selectedCity !== "All" ? `• ${cities.find(c => c.value === selectedCity)?.label}` : ""}`.trim()}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-300">
                            <span className="font-semibold text-white">{filteredPhotographers.length}</span>{" "}
                            photographers found
                        </p>
                        <p className="text-gray-400 text-sm">
                            {selectedState !== "All" && `State: ${states.find(s => s.value === selectedState)?.label}`}
                            {selectedCity !== "All" && ` • City: ${cities.find(c => c.value === selectedCity)?.label}`}
                        </p>
                    </div>
                </div>

                {/* Photographers Grid */}
                {filteredPhotographers.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Camera size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No Photographers Found
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={() => {
                                setSelectedState("All");
                                setSelectedCity("All");
                                setSearchTerm("");
                            }}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPhotographers.map((photographer) => (
                            <PhotographerCard key={photographer._id} photographer={photographer} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// Separate Card Component for reusability
function PhotographerCard({ photographer }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            {/* Photo */}
            <div className="relative w-full h-64 overflow-hidden">
                <Image
                    src={photographer.photos?.[0]?.url || "/default-photographer.jpg"}
                    alt={photographer.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    {/* REMOVED: services counter - "services" tracker removed */}
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded capitalize">
                        {photographer.state}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{photographer.name}</h3>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-600">
                        <MapPin size={16} />
                        <span className="text-sm capitalize">{photographer.city}</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded-full capitalize">
                        {photographer.state}
                    </span>
                </div>

                {photographer.biography && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {photographer.biography}
                    </p>
                )}

                {/* REMOVED: Services Preview - this is also a tracker */}

                <Link
                    href={`/cameras/profile/${photographer._id}`}
                    className="w-full bg-yellow-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-yellow-400 transition block"
                >
                    View Portfolio
                </Link>
            </div>
        </div>
    );
}