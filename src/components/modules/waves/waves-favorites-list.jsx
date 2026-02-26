"use client";
import { useEffect, useState } from "react";
import WaveItem from "./wave-item";

export default function WavesFavoritesList({
  setWave,
  playingWaveId,
  setPlayingWaveId,
  sectionText
}) {
  const [waves, setWaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchWaves = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/waves`);
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.data?.waves)) {
          setWaves(data.data.waves);
          // Only set first wave if no wave is selected
          if (data.data.waves.length > 0) {
            setWave(prev => prev || data.data.waves[0]);
          }
        } else {
          setWaves([]);
        }
      } catch (err) {
        console.error("Error fetching waves:", err);
        setWaves([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWaves();
  }, [API_BASE, setWave]);

  const handleWaveClick = (wave) => {
    setWave(wave);
    setPlayingWaveId(wave._id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">
          {sectionText?.yourWavesTitle || "Your Waves"}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!waves.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">
          {sectionText?.yourWavesTitle || "Your Waves"}
        </h2>
        <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg">
          No waves available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">
        {sectionText?.yourWavesTitle || "Your Waves"}
      </h2>

      <div className="space-y-3 max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {waves.map((wave) => (
          <div
            key={wave._id}
            onClick={() => handleWaveClick(wave)}
            className="cursor-pointer"
          >
            <WaveItem
              wave={wave}
              isPlaying={playingWaveId === wave._id}
              onPlayClick={() => handleWaveClick(wave)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}