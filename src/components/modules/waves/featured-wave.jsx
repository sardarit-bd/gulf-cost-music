"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function FeaturedWave() {
  const [latestWave, setLatestWave] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/waves`, { cache: "no-store" });
        const data = await res.json();

        const waves = data?.data?.waves || [];
        if (res.ok && data.success && waves.length > 0) {
          const sorted = [...waves].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestWave(sorted[0]);
        }
      } catch (err) {
        console.error("Error loading featured wave:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [API_BASE]);

  if (loading) {
    return (
      <div className="rounded-xl bg-gray-100 animate-pulse h-[550px] w-full" />
    );
  }

  if (!latestWave) {
    return (
      <div className="text-center text-gray-500">
        No featured wave available.
      </div>
    );
  }

  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">Waves</h2>
        <p className="text-gray-600">
          Explore the freshest waves and top audio experiences.
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-[550px] w-full">
          <Image
            src={latestWave.thumbnail || "/placeholder.svg"}
            alt={latestWave.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {latestWave.title}
            </h3>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <span>🌊</span>
              <span>WAVE</span>
            </div>
          </div>

          <a
            href={latestWave.audioUrl || latestWave.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
          >
            Listen Now 🎧
          </a>
        </div>
      </div>
    </div>
  );
}
