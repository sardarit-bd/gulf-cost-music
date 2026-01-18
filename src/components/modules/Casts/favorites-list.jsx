"use client";
import { useEffect, useState } from "react";
import FavoriteItem from "./favorite-item";

export default function FavoritesList({ setCast, activeCast }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/casts`, { cache: "no-store" });
        const data = await res.json();
        console.log("list:", data);

        if (res.ok && data.success && Array.isArray(data.data.casts)) {
          setFavorites(data.data.casts);
          setCast(data.data.casts[0]);
        } else {
          console.warn("No valid podcast data found");
          setFavorites([]);
        }
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [API_BASE, setCast]);


  if (loading)
    return <p className="text-gray-600 animate-pulse">Loading podcasts...</p>;

  if (!favorites.length)
    return <p className="text-gray-500">No podcasts available.</p>;


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Your Favorites</h2>

      <div className="space-y-3 max-h-[600px] overflow-y-auto p-4">
        {favorites.map((favorite) => (
          <div
            key={favorite._id}
            onClick={() => setCast(favorite)}
            className="cursor-pointer"
          >
            <FavoriteItem
              favorite={favorite}
              isActive={activeCast?._id === favorite._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
