"use client";
import { Camera, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PhotographersPage() {
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("All");

    const cities = ["All", "New Orleans", "Biloxi", "Mobile", "Pensacola"];

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
        const matchesCity = selectedCity === "All" || p.city === selectedCity.toLowerCase();
        return matchesSearch && matchesCity;
    });

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
                        Professional Photographers
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover talented photographers and videographers across the Gulf Coast region
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
                                    placeholder="Search photographers by name or specialty..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* City Filter */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            {cities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${selectedCity === city
                                        ? "bg-yellow-500 text-black"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-300">
                        Showing <span className="font-semibold text-white">{filteredPhotographers.length}</span>{" "}
                        {selectedCity === "All" ? "photographers" : `photographers in ${selectedCity}`}
                    </p>
                </div>

                {/* Photographers Grid */}
                {filteredPhotographers.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Camera size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Photographers Found</h3>
                        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPhotographers.map((photographer) => (
                            <div
                                key={photographer._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                            >
                                {/* Photo */}
                                <div className="relative w-full h-64 overflow-hidden">
                                    <Image
                                        src={photographer.photos?.[0]?.url || "/default-photographer.jpg"}
                                        alt={photographer.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                        <span className="text-white text-sm font-medium">
                                            {photographer.services?.length || 0} services
                                        </span>
                                        <span className="text-white text-sm font-medium">
                                            {photographer.photos?.length || 0} photos
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{photographer.name}</h3>
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                                        <MapPin size={16} />
                                        <span className="text-sm capitalize">{photographer.city}</span>
                                    </div>

                                    {photographer.biography && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {photographer.biography}
                                        </p>
                                    )}

                                    {/* Services Preview */}
                                    {photographer.services && photographer.services.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {photographer.services.slice(0, 2).map((service, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium"
                                                    >
                                                        {service.service}
                                                    </span>
                                                ))}
                                                {photographer.services.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        +{photographer.services.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Link
                                        href={`/cameras/${photographer.city}/${photographer._id}`}
                                        className="w-full bg-yellow-500 text-black text-center py-3 rounded-lg font-semibold hover:bg-yellow-400 transition block"
                                    >
                                        View Portfolio
                                    </Link>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}