"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, Filter, Music, Headphones, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { formatCityName, formatStateName, formatLocation } from "@/utils/formatters";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export default function StudiosPage() {
    const [studios, setStudios] = useState([]);
    const [filteredStudios, setFilteredStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All");
    const [cities, setCities] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // States for Gulf Coast
    const states = [
        { value: "All", label: "All States", color: "bg-gray-100 text-gray-800" },
        { value: "Louisiana", label: "Louisiana", color: "bg-blue-100 text-blue-800" },
        { value: "Mississippi", label: "Mississippi", color: "bg-green-100 text-green-800" },
        { value: "Alabama", label: "Alabama", color: "bg-red-100 text-red-800" },
        { value: "Florida", label: "Florida", color: "bg-purple-100 text-purple-800" }
    ];

    // Fetch all studios
    useEffect(() => {
        fetchStudios();
    }, []);

    // Update cities when state changes
    useEffect(() => {
        if (selectedState === "All") {
            setCities([]);
            setSelectedCity("All");
        } else {
            const stateStudios = studios.filter(s => s.state === selectedState);
            const uniqueCities = [...new Set(stateStudios.map(s => s.city.toLowerCase()))]
                .sort()
                .map(city => ({
                    value: city,
                    label: formatCityName(city) // FIXED: Using formatter
                }));
            setCities(uniqueCities);
            setSelectedCity("All");
        }
    }, [selectedState, studios]);

    // Apply filters
    useEffect(() => {
        filterStudios();
    }, [selectedState, selectedCity, searchTerm, studios]);

    const fetchStudios = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/studios/location`);
            setStudios(response.data.data || []);
        } catch (error) {
            console.error('Error fetching studios:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterStudios = () => {
        let filtered = [...studios];

        // Filter by state
        if (selectedState !== "All") {
            filtered = filtered.filter(studio => studio.state === selectedState);
        }

        // Filter by city
        if (selectedCity !== "All") {
            filtered = filtered.filter(studio =>
                studio.city.toLowerCase() === selectedCity.toLowerCase()
            );
        }

        // Filter by search query
        if (searchTerm.trim() !== "") {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(studio =>
                studio.name.toLowerCase().includes(query) ||
                studio.city.toLowerCase().includes(query) ||
                studio.biography.toLowerCase().includes(query) ||
                (studio.services && studio.services.some(s =>
                    s.service.toLowerCase().includes(query)
                ))
            );
        }

        setFilteredStudios(filtered);
    };

    const handleStateClick = (state) => {
        setSelectedState(state);
    };

    const handleCityClick = (city) => {
        setSelectedCity(city);
    };

    const handleClearFilters = () => {
        setSelectedState("All");
        setSelectedCity("All");
        setSearchTerm("");
    };

    const getStartingPrice = (services) => {
        if (!services || services.length === 0) return "Contact for price";

        const prices = services
            .map(s => parseFloat(s.price.replace(/[^0-9.]/g, '')))
            .filter(p => !isNaN(p));

        if (prices.length === 0) return "Contact for price";

        return `From $${Math.min(...prices)}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-yellow-400 text-lg">Loading studios...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Headphones className="w-12 h-12 text-yellow-500" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Recording Studios
                        </h1>
                        <Music className="w-12 h-12 text-yellow-500" />
                    </div>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover professional recording studios across the Gulf Coast region
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                        {/* Search Bar */}
                        <div className="flex-1 w-full md:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search studios by name, city, or services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>

                    {/* State Filter */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
                            Filter by State
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {states.map((state) => (
                                <button
                                    key={state.value}
                                    onClick={() => handleStateClick(state.value)}
                                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${state.color} ${selectedState === state.value
                                        ? "ring-2 ring-offset-2 ring-yellow-500 transform scale-105"
                                        : "hover:opacity-90"
                                        }`}
                                >
                                    {state.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City Filter (only if state selected) */}
                    {selectedState !== "All" && cities.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Cities in {selectedState}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleCityClick("All")}
                                    className={`px-4 py-2 rounded-lg border-2 ${selectedCity === "All"
                                        ? "bg-yellow-500 text-black border-yellow-500"
                                        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500"
                                        }`}
                                >
                                    All Cities
                                </button>
                                {cities.map((city) => (
                                    <button
                                        key={city.value}
                                        onClick={() => handleCityClick(city.value)}
                                        className={`px-4 py-2 rounded-lg border-2 ${selectedCity === city.value
                                            ? "bg-yellow-500 text-black border-yellow-500"
                                            : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500"
                                            }`}
                                    >
                                        {city.label} {/* FIXED: Already formatted */}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="pt-6 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-bold text-yellow-500">{filteredStudios.length}</span>
                                <span className="text-gray-300 ml-2">
                                    {filteredStudios.length === 1 ? 'studio' : 'studios'} found
                                    {selectedState !== "All" && ` in ${selectedState}`}
                                    {selectedCity !== "All" && `, ${formatCityName(selectedCity)}`} {/* FIXED */}
                                </span>
                            </div>
                            {(selectedState !== "All" || selectedCity !== "All" || searchTerm) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Studios Grid */}
                {filteredStudios.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Music size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Studios Found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm
                                ? `No studios match "${searchTerm}"`
                                : selectedState !== "All"
                                    ? `No studios available in ${selectedState}`
                                    : 'No studios available at the moment'}
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                            View All Studios
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStudios.map((studio) => (
                            <div
                                key={studio._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                            >
                                {/* Studio Image */}
                                <div className="relative w-full h-64 overflow-hidden">
                                    <Image
                                        src={studio.photos?.[0]?.url || "/default-studio.jpg"}
                                        alt={studio.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                        <span className="text-white text-sm font-medium">
                                            {studio.services?.length || 0} services
                                        </span>
                                        <span className="text-white text-sm font-medium">
                                            {studio.photos?.length || 0} photos
                                        </span>
                                    </div>
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {studio.isVerified && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                                <Star size={12} />
                                                Verified
                                            </span>
                                        )}
                                        {studio.isFeatured && (
                                            <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-semibold">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                                            {studio.state}
                                        </span>
                                    </div>
                                </div>

                                {/* Studio Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{studio.name}</h3>
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                                        <MapPin size={16} />
                                        <span className="text-sm">
                                            {formatLocation(studio.city, studio.state)} {/* FIXED */}
                                        </span>
                                    </div>

                                    {/* Biography Excerpt */}
                                    {studio.biography && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {studio.biography}
                                        </p>
                                    )}

                                    {/* Services Preview */}
                                    {studio.services && studio.services.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Headphones size={16} className="text-blue-500" />
                                                <span className="text-sm font-semibold text-gray-700">Services</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {studio.services.slice(0, 3).map((service, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                                                    >
                                                        {service.service}
                                                    </span>
                                                ))}
                                                {studio.services.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        +{studio.services.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price and Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} className="text-green-600" />
                                            <span className="font-bold text-green-700">
                                                {getStartingPrice(studio.services)}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/studios/${studio.state}/${studio.city}/${studio._id}`}
                                            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                                        >
                                            View Studio
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Footer */}
                <div className="mt-12 bg-white/5 rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-center text-white mb-8">
                        Studios Across Gulf Coast
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {states.slice(1).map((state) => {
                            const count = studios.filter(s => s.state === state.value).length;
                            const citiesCount = [...new Set(
                                studios.filter(s => s.state === state.value).map(s => formatCityName(s.city))
                            )].length; // FIXED: Using formatter

                            return (
                                <div key={state.value} className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${state.color.split(' ')[0]} mb-4`}>
                                        <span className="text-2xl font-bold">{count}</span>
                                    </div>
                                    <div className="font-bold text-xl text-white mb-1">{state.label}</div>
                                    <div className="text-gray-300">{citiesCount} cities</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}