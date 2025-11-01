"use client";
import { useState, useEffect } from "react";
import FavoriteItem from "./favorite-item";

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cast`);
        const data = await res.json();
        if (res.ok && data.success) {
          setFavorites(data.data.casts);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [API_BASE]);

  if (loading) return <p>Loading podcasts...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Your Favorites</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {favorites.map((favorite) => (
          <FavoriteItem key={favorite._id} favorite={favorite} />
        ))}
      </div>
    </div>
  );
}
