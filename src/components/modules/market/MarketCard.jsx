"use client";

import Link from "next/link";
import { MapPin, Package, DollarSign } from "lucide-react";

export default function MarketCard({ item }) {
    const cover = item?.photos?.[0] || "/placeholder.jpg";

    return (
        <Link
            href={`/market/${item._id}`}
            className="group rounded-2xl overflow-hidden border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950 hover:border-yellow-500/40 transition"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={cover}
                    alt={item?.title || "Market item"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-300 border border-yellow-500/20">
                        <DollarSign size={12} /> {Number(item?.price || 0).toFixed(2)}
                    </span>
                    {item?.status && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                            <Package size={12} /> {item.status}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-3">
                <div>
                    <h3 className="text-white font-bold text-lg line-clamp-1">{item?.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{item?.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 capitalize">
                        {item?.sellerType || "seller"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-300">
                        <MapPin size={14} className="text-yellow-400" />
                        {item?.location || "—"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
