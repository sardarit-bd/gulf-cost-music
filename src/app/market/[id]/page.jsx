"use client";

import { ArrowLeft, Camera, DollarSign, MapPin, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ===============================
   INLINE API FUNCTION (NO lib FILE)
================================ */

async function fetchMarketItemById({ API_BASE, id }) {
    const res = await fetch(`${API_BASE}/api/market/${id}`, {
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to load item");
    }

    return data; // { success, data }
}

/* ===============================
   PAGE
================================ */

export default function MarketItemPage() {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await fetchMarketItemById({ API_BASE, id });
                setItem(res.data);
            } catch (e) {
                toast.error(e.message || "Failed to load item");
            } finally {
                setLoading(false);
            }
        })();
    }, [API_BASE, id]);

    if (loading) {
        return (
            <div className="min-h-screen mt-[90px] flex items-center justify-center bg-black">
                <div className="text-yellow-400 font-semibold">Loading item...</div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen mt-[90px] flex items-center justify-center bg-black text-white">
                Item not found.
            </div>
        );
    }

    return (
        <section className="min-h-screen mt-[90px] px-5 py-10 bg-gradient-to-br from-gray-950 to-black">
            <div className="container mx-auto space-y-6">
                <button
                    onClick={() => router.push("/market")}
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                    <ArrowLeft size={18} />
                    Back to Market
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Media */}
                    <div className="space-y-4">
                        <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-900">
                            <img
                                src={item.photos?.[0] || "/placeholder.jpg"}
                                alt={item.title}
                                className="w-full aspect-[4/3] object-cover"
                            />
                        </div>

                        {item.photos?.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {item.photos.slice(0, 5).map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl overflow-hidden border border-gray-700"
                                    >
                                        <img
                                            src={p}
                                            alt={`photo ${idx + 1}`}
                                            className="w-full aspect-square object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {item.video && (
                            <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-900">
                                <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2 text-white font-semibold">
                                    <Video size={16} className="text-yellow-400" />
                                    Video
                                </div>
                                <video controls className="w-full">
                                    <source src={item.video} type="video/mp4" />
                                </video>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950 p-6 space-y-5">
                        <h1 className="text-white text-3xl font-extrabold">
                            {item.title}
                        </h1>

                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 font-bold">
                                <DollarSign size={16} />
                                {Number(item.price || 0).toFixed(2)}
                            </span>

                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                <MapPin size={16} />
                                {item.location || "—"}
                            </span>

                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize">
                                <Camera size={16} />
                                {item.sellerType}
                            </span>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
                            <h3 className="text-white font-semibold mb-2">Description</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        <div className="text-gray-400 text-sm">
                            Listed:{" "}
                            <span className="text-white font-semibold">
                                {new Date(item.createdAt).toISOString().split("T")[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
