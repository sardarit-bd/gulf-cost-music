"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Music, Star, Headphones, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export default function StudiosByState() {
    const { state } = useParams();
    const router = useRouter();
    const formattedState = decodeURIComponent(state);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("All");

    // Fetch studios by state
    useEffect(() => {
        fetchStudiosByState();
    }, [state]);

    // Get unique cities from studios
    useEffect(() => {
        if (studios.length > 0) {
            const uniqueCities = [...new Set(studios.map(s => s.city.toLowerCase()))]
                .sort()
                .map(city => ({
                    value: city,
                    label: city.charAt(0).toUpperCase() + city.slice(1)
                }));
            setCities(uniqueCities);
        }
    }, [studios]);

    const fetchStudiosByState = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/studios/location?state=${formattedState}`);
            setStudios(response.data.data || []);
        } catch (error) {
            console.error('Error fetching studios:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter studios by selected city
    const filteredStudios = selectedCity === "All"
        ? studios
        : studios.filter(studio =>
            studio.city.toLowerCase() === selectedCity.toLowerCase()
        );

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
                    <p className="text-yellow-400 text-lg">Loading studios in {formattedState}...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <button
                            onClick={() => router.push("/studios")}
                            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition"
                        >
                            <ArrowLeft size={20} />
                            Back to All Studios
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Studios in {formattedState}
                        </h1>
                        <p className="text-gray-300 mt-2">
                            Professional recording studios in {formattedState}
                        </p>
                    </div>

                    <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
                        {studios.length} {studios.length === 1 ? 'Studio' : 'Studios'}
                    </div>
                </div>

                {/* City Filter */}
                {cities.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
                            Filter by City
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedCity("All")}
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
                                    onClick={() => setSelectedCity(city.value)}
                                    className={`px-4 py-2 rounded-lg border-2 ${selectedCity === city.value
                                        ? "bg-yellow-500 text-black border-yellow-500"
                                        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500"
                                        }`}
                                >
                                    {city.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-gray-300">
                            Showing {filteredStudios.length} {filteredStudios.length === 1 ? 'studio' : 'studios'}
                            {selectedCity !== "All" && ` in ${selectedCity}`}
                        </div>
                    </div>
                )}

                {/* Studios Grid */}
                {filteredStudios.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Music size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No Studios Found in {formattedState}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            We don't have any studios registered in this area yet.
                        </p>
                        <button
                            onClick={() => router.push("/studios")}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                            Browse All Studios
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
                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full capitalize">
                                            {studio.city}
                                        </span>
                                    </div>
                                </div>

                                {/* Studio Info */}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{studio.name}</h2>

                                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                                        <MapPin size={16} />
                                        <span className="text-sm capitalize">{studio.city}</span>
                                    </div>

                                    {/* Biography Excerpt */}
                                    {studio.biography && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {studio.biography}
                                        </p>
                                    )}

                                    {/* Services Count */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <Headphones size={16} className="text-blue-500" />
                                        <span className="text-sm text-gray-700">
                                            {studio.services?.length || 0} services available
                                        </span>
                                    </div>

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

                {/* Cities List */}
                {cities.length > 0 && (
                    <div className="mt-12 bg-white/5 rounded-2xl p-8 border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Cities in {formattedState}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {cities.map((city) => {
                                const cityStudios = studios.filter(s =>
                                    s.city.toLowerCase() === city.value.toLowerCase()
                                ).length;

                                return (
                                    <Link
                                        key={city.value}
                                        href={`/studios/${formattedState}/${city.value}`}
                                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 hover:from-yellow-500/10 hover:to-yellow-500/5 border border-gray-700 hover:border-yellow-500/30 transition-all duration-300"
                                    >
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-500 mb-2">{cityStudios}</div>
                                            <div className="text-lg font-semibold text-white">{city.label}</div>
                                            <div className="text-gray-300 text-sm mt-1">
                                                {cityStudios} {cityStudios === 1 ? 'studio' : 'studios'}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}