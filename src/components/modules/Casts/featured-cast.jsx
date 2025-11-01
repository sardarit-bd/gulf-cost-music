"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function FeaturedCast() {
  const [latestCast, setLatestCast] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cast`);
        const data = await res.json();
        if (res.ok && data.success && data.data.casts?.length > 0) {
          setLatestCast(data.data.casts[0]);
        }
      } catch (err) {
        console.error("Error loading featured cast:", err);
      }
    };
    fetchLatest();
  }, [API_BASE]);

  if (!latestCast) return null;

  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">Cast</h2>
        <p className="text-gray-600">
          Tune into engaging podcast episodes featuring your favorite personalities
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-[550px] w-full">
          <Image
            src={latestCast.thumbnail}
            alt={latestCast.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{latestCast.title}</h3>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <span>🌴</span>
              <span>PODCAST</span>
            </div>
          </div>

          <a
            href={latestCast.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
