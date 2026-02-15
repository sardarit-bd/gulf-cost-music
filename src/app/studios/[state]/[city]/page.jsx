"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Music, Star, Headphones, DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export default function StudiosByCity() {
    const { state, city } = useParams();
    const router = useRouter();
    const formattedState = decodeURIComponent(state);
    const formattedCity = decodeURIComponent(city);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch studios by city
    useEffect(() => {
        fetchStudiosByCity();
    }, [state, city]);

    const fetchStudiosByCity = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE}/api/studios/location?state=${formattedState}&city=${formattedCity.toLowerCase()}`
            );
            setStudios(response.data.data || []);
        } catch (error) {
            console.error('Error fetching studios:', error);
        } finally {
            setLoading(false);
        }
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
                    <p className="text-yellow-400 text-lg">Loading studios in {formattedCity}...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4">
            <div className="container mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-gray-300 mb-6">
                    <Link href="/studios" className="hover:text-yellow-400 transition">
                        Studios
                    </Link>
                    <ChevronRight size={16} />
                    <Link href={`/studios/${formattedState}`} className="hover:text-yellow-400 transition">
                        {formattedState}
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-yellow-400 capitalize">{formattedCity}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <button
                            onClick={() => router.push(`/studios/${formattedState}`)}
                            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition"
                        >
                            <ArrowLeft size={20} />
                            Back to {formattedState}
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
                            Studios in {formattedCity}, {formattedState}
                        </h1>
                        <p className="text-gray-300 mt-2">
                            Find the perfect recording studio in {formattedCity}
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-bold text-lg">
                        {studios.length} {studios.length === 1 ? 'Studio' : 'Studios'}
                    </div>
                </div>

                {studios.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Music size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No Studios in {formattedCity}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            We don't have any studios registered in {formattedCity} yet.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push(`/studios/${formattedState}`)}
                                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition"
                            >
                                View {formattedState} Studios
                            </button>
                            <button
                                onClick={() => router.push("/studios")}
                                className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                            >
                                Browse All Studios
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Studios Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {studios.map((studio) => (
                                <div
                                    key={studio._id}
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2 group border border-gray-700"
                                >
                                    {/* Studio Image */}
                                    <div className="relative w-full h-64 overflow-hidden">
                                        <Image
                                            src={studio.photos?.[0]?.url || "/default-studio.jpg"}
                                            alt={studio.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

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

                                        {/* Studio Name Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h2 className="text-2xl font-bold text-white">{studio.name}</h2>
                                        </div>
                                    </div>

                                    {/* Studio Info */}
                                    <div className="p-6">
                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-gray-300 mb-4">
                                            <MapPin size={18} className="text-yellow-500" />
                                            <span className="capitalize">{studio.city}, {studio.state}</span>
                                        </div>

                                        {/* Biography Excerpt */}
                                        {studio.biography && (
                                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                                {studio.biography}
                                            </p>
                                        )}

                                        {/* Services Preview */}
                                        {studio.services && studio.services.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Headphones size={18} className="text-blue-400" />
                                                    <span className="text-sm font-semibold text-white">Services</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {studio.services.slice(0, 3).map((service, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium border border-blue-500/30"
                                                        >
                                                            {service.service}
                                                        </span>
                                                    ))}
                                                    {studio.services.length > 3 && (
                                                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                                            +{studio.services.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Audio Sample Indicator */}
                                        {studio.audioFile && (
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-green-400">Audio sample available</span>
                                            </div>
                                        )}

                                        {/* Price and Action */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={18} className="text-green-500" />
                                                <span className="font-bold text-green-400 text-lg">
                                                    {getStartingPrice(studio.services)}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/studios/${studio.state}/${studio.city}/${studio._id}`}
                                                className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
                                            >
                                                View Studio
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* City Stats */}
                        <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                Recording Studios in {formattedCity}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-gray-700/50 rounded-xl">
                                    <div className="text-4xl font-bold text-yellow-500 mb-2">{studios.length}</div>
                                    <div className="text-white font-semibold">Studios</div>
                                    <div className="text-gray-300 text-sm">In {formattedCity}</div>
                                </div>
                                <div className="text-center p-6 bg-gray-700/50 rounded-xl">
                                    <div className="text-4xl font-bold text-green-500 mb-2">
                                        {studios.reduce((acc, studio) => acc + (studio.services?.length || 0), 0)}
                                    </div>
                                    <div className="text-white font-semibold">Total Services</div>
                                    <div className="text-gray-300 text-sm">Across all studios</div>
                                </div>
                                <div className="text-center p-6 bg-gray-700/50 rounded-xl">
                                    <div className="text-4xl font-bold text-blue-500 mb-2">
                                        {studios.filter(s => s.isVerified).length}
                                    </div>
                                    <div className="text-white font-semibold">Verified</div>
                                    <div className="text-gray-300 text-sm">Trusted studios</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}