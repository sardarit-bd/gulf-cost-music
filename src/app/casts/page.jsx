"use client"
import FavoritesList from "@/components/modules/Casts/favorites-list";
import FeaturedCast from "@/components/modules/Casts/featured-cast";
import { useEffect, useState } from "react";

export default function CastsSection() {
  const [cast, setCast] = useState(null);
  const [allCasts, setAllCasts] = useState([]);

  useEffect(() => {
    const fetchCasts = async () => {
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const res = await fetch(`${API_BASE}/api/casts`, { cache: "no-store" });
        const data = await res.json();
        console.log("cust section", data)
        if (res.ok && data.success && Array.isArray(data.data.casts)) {
          setAllCasts(data.data.casts);
          if (data.data.casts.length > 0 && !cast) {
            setCast(data.data.casts[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching casts:", error);
      }
    };
    fetchCasts();
  }, []);

  return (
    <div
      className="py-16 px-6 md:px-16 mt-20"
      style={{
        background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Favorites */}
        <div className="lg:col-span-1">
          <FavoritesList
            setCast={setCast}
            activeCast={cast}
          />
        </div>

        {/* Right Column - Featured Cast */}
        <div className="lg:col-span-2">
          <FeaturedCast cast={cast} />
        </div>
      </div>
    </div>
  )
}