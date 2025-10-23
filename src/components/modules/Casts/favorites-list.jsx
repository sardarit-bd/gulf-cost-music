"use client";

import { useState } from "react";
import FavoriteItem from "./favorite-item";

const mockFavorites = [
  { id: 1, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 2, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 3, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 4, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 5, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 6, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 7, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 8, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 9, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
  { id: 10, title: "John Doe", category: "Pop Music", image: "/images/postcast.webp" },
];

export default function FavoritesList() {
  const [favorites] = useState(mockFavorites);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Your Favorites</h2>

      {/* Scrollable vertical list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {favorites.map((favorite) => (
          <FavoriteItem key={favorite.id} favorite={favorite} />
        ))}
      </div>
    </div>
  );
}
