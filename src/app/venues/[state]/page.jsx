"use client";
import { ArrowLeft, ChevronRight, Filter, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StateVenuesPage() {
    const { state } = useParams();
    const router = useRouter();
    const [venues, setVenues] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("All");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    // Format state name for display
    const formattedState = decodeURIComponent(state)
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        fetchStateVenues();
    }, [state]);

    const fetchStateVenues = async () => {
        setLoading(true);
        try {
            console.log("Fetching venues for state:", formattedState);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/by-state?state=${encodeURIComponent(formattedState)}`
            );

            console.log("Response status:", res.status);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            const data = await res.json();
            console.log("API Data:", data);

            if (data.success) {
                setCities(data.data.cities || []);
                // Flatten all venues from all cities
                const allVenues = data.data.cities.flatMap(city => city.venues || []);
                console.log("All venues:", allVenues);

                const fixed = allVenues.map((v) => ({
                    ...v,
                    photos: v.photos?.length > 0 ? v.photos : [{
                        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                    }],
                }));
                setVenues(fixed);
            } else {
                console.error("API returned success false:", data.message);
            }
        } catch (error) {
            console.error("Error fetching state venues:", error);
            setCities([]);
            setVenues([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter venues
    const filteredVenues = venues
        .filter(venue =>
            (selectedCity === "All" || venue.city === selectedCity) &&
            (searchTerm === "" ||
                venue.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venue.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venue.biography?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.venueName?.localeCompare(b.venueName);
                case "capacity":
                    return (b.seatingCapacity || 0) - (a.seatingCapacity || 0);
                case "city":
                    return a.city?.localeCompare(b.city);
                default:
                    return 0;
            }
        });

    const formatCityName = (city) => {
        if (!city) return "Unknown";
        return city
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getCapacityColor = (capacity) => {
        if (!capacity) return "text-gray-500";
        if (capacity > 1000) return "text-green-600";
        if (capacity > 500) return "text-blue-600";
        if (capacity > 200) return "text-yellow-600";
        return "text-gray-600";
    };

    if (loading) {
        return (
            <section className="brandBg min-h-screen py-14 mt-20 px-6">
                <div className="container mx-auto">
                    {/* Header Skeleton */}
                    <div className="mb-10">
                        <div className="h-12 bg-gray-700/50 rounded-lg w-64 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-600/50 rounded w-48 animate-pulse"></div>
                    </div>

                    {/* Cities Skeleton */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 animate-pulse">
                        <div className="h-8 bg-gray-600/30 rounded w-48 mb-4"></div>
                        <div className="flex flex-wrap gap-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-600/30 rounded-lg w-32"></div>
                            ))}
                        </div>
                    </div>

                    {/* Venues Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white/10 rounded-2xl overflow-hidden animate-pulse">
                                <div className="w-full h-56 bg-gray-600/30"></div>
                                <div className="p-5">
                                    <div className="h-6 bg-gray-600/30 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-600/30 rounded mb-3 w-3/4"></div>
                                    <div className="h-8 bg-gray-600/30 rounded-full w-20"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="brandBg min-h-screen py-4 mt-20 px-6">
            <div className="container mx-auto">
                {/* Breadcrumb Navigation */}
                <div className="flex justify-center items-center gap-2 text-gray-300 mb-6 text-sm">
                    <Link href="/venues" className="hover:text-yellow-400 transition">
                        Venues
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-yellow-400 font-semibold">{formattedState}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <button
                            onClick={() => router.push("/venues")}
                            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition"
                        >
                            <ArrowLeft size={20} />
                            Back to All States
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Venues in {formattedState}
                        </h1>
                        <p className="text-gray-300 mt-2">
                            Discover amazing music venues across {formattedState}
                        </p>
                    </div>

                    <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold text-lg">
                        {venues.length} {venues.length === 1 ? "Venue" : "Venues"}
                    </div>
                </div>

                {/* City Filter */}
                {cities.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
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
                                    key={city.name}
                                    onClick={() => setSelectedCity(city.name)}
                                    className={`px-4 py-2 rounded-lg border-2 ${selectedCity === city.name
                                        ? "bg-yellow-500 text-black border-yellow-500"
                                        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500"
                                        }`}
                                >
                                    {city.displayName}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-gray-300">
                            Showing {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"}
                            {selectedCity !== "All" && ` in ${formatCityName(selectedCity)}`}
                        </div>
                    </div>
                )}

                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                    <div className="flex-1 w-full">
                        <input
                            type="text"
                            placeholder={`Search venues in ${formattedState}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="capacity">Sort by Capacity</option>
                            <option value="city">Sort by City</option>
                        </select>
                    </div>
                </div>

                {/* Venues Grid */}
                {filteredVenues.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <MapPin size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No Venues Found in {formattedState}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm
                                ? `No venues match "${searchTerm}"`
                                : selectedCity !== "All"
                                    ? `No venues available in ${formatCityName(selectedCity)}`
                                    : 'No venues available in this state yet.'}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCity("All");
                            }}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredVenues.map((venue) => (
                            <div
                                key={venue._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative w-full h-56">
                                    <Image
                                        src={venue.photos?.[0]?.url || "/default.jpg"}
                                        alt={venue.venueName}
                                        fill
                                        className="object-cover rounded-t-2xl"
                                    />
                                    {/* City Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 backdrop-blur-sm">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {formatCityName(venue.city)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                                        {venue.venueName}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-2">{venue.address}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className={`text-sm font-semibold ${getCapacityColor(venue.seatingCapacity)}`}>
                                                {venue.seatingCapacity ? `${venue.seatingCapacity} capacity` : "Capacity N/A"}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/venues/${venue.state.toLowerCase()}/${venue.city}/${venue._id}`}
                                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg"
                                        >
                                            View Details
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
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Cities in {formattedState}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {cities.map((city) => {
                                const cityVenues = venues.filter(v => v.city === city.name).length;

                                return (
                                    <Link
                                        key={city.name}
                                        href={`/venues/${encodeURIComponent(formattedState.toLowerCase())}/${encodeURIComponent(city.name)}`}
                                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 hover:from-yellow-500/10 hover:to-yellow-500/5 border border-gray-700 hover:border-yellow-500/30 transition-all duration-300"
                                    >
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-500 mb-2">
                                                {cityVenues}
                                            </div>
                                            <div className="text-lg font-semibold text-white">
                                                {city.displayName}
                                            </div>
                                            <div className="text-gray-300 text-sm mt-1">
                                                {cityVenues} {cityVenues === 1 ? "venue" : "venues"}
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