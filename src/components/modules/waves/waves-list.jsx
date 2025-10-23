"use client";

import { useState } from "react";
import WaveItem from "./wave-item";
import FeaturedWave from "./featured-wave";

const mockWaves = [
  { id: 1, title: "Soul Tide", category: "Live Music", image: "/images/waves-banner.webp" },
  { id: 2, title: "Coastal Beats", category: "DJ Night", image: "/images/waves-banner.webp" },
  { id: 3, title: "Blue Horizon", category: "Jazz", image: "/images/waves-banner.webp" },
  { id: 4, title: "Harbor Lights", category: "Acoustic", image: "/images/waves-banner.webp" },
  { id: 5, title: "Sunset Vibes", category: "Pop", image: "/images/waves-banner.webp" },
  { id: 6, title: "Ocean Flow", category: "Rock", image: "/images/waves-banner.webp" },
];

export default function WavesList() {
  const [waves] = useState(mockWaves);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Your Waves</h2>

      {/* Scrollable vertical list */}
      <div className="flex flex-col space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 rounded-md">
        {waves.map((wave) => (
          <FeaturedWave key={wave.id} wave={wave} />
        ))}
      </div>
    </div>
  );
}
