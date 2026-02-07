"use client";
import { ArrowLeft, Camera, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PhotographersByState() {
    const { state } = useParams();
    const router = useRouter();

    // State mapping for display
    const stateMap = {
        louisiana: "Louisiana",
        mississippi: "Mississippi",
        alabama: "Alabama",
        florida: "Florida"
    };

    const formattedState = stateMap[state] || state;
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state || !stateMap[state]) {
            router.push("/cameras");
            return;
        }

        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/photographers?state=${state}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setPhotographers(data.data.photographers);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [state]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-yellow-400">
                <div className="text-center">
                    <Camera size={48} className="mx-auto mb-4 animate-pulse" />
                    <p>Loading {formattedState} photographers...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-14 mt-20 px-6 min-h-screen">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        {/* Back Button */}
                        <button
                            onClick={() => router.push("/cameras")}
                            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to All Photographers</span>
                        </button>

                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Photographers in {formattedState}
                        </h1>
                        <p className="text-gray-300 mt-2">
                            Professional photographers across {formattedState}
                        </p>
                    </div>

                    <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
                        {photographers.length} {photographers.length === 1 ? 'Photographer' : 'Photographers'}
                    </div>
                </div>

                {photographers.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Camera size={64} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No Photographers in {formattedState} Yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Be the first photographer to register from {formattedState}!
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => router.push("/cameras")}
                                className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                            >
                                Browse All Photographers
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {photographers.map((p) => (
                            <div key={p._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                                <div className="relative w-full h-64 overflow-hidden">
                                    <Image
                                        src={p.photos?.[0]?.url || "/default-photographer.jpg"}
                                        alt={p.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                                        {p.services?.length || 0} services
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h2>

                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MapPin size={16} />
                                            <span className="text-sm capitalize">{p.city}</span>
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded-full capitalize">
                                            {p.state}
                                        </span>
                                    </div>

                                    {p.biography && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {p.biography}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            {p.photos?.length || 0} portfolio photos
                                        </div>
                                        {/* CRITICAL FIX: p._id ব্যবহার করুন */}
                                        <Link
                                            href={`/cameras/${state}/${p._id}`} // এখানে p._id
                                            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}