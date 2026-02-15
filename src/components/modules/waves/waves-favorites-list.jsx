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
        const res = await fetch(`${API_BASE}/api/waves`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data.waves)) {
          setWaves(data.data.waves);
          if (data.data.waves.length > 0) {
            setWave(data.data.waves[0]);
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
  }, [API_BASE]);

  const handlePlayClick = (waveId) => {
    setPlayingWaveId(waveId);
    const selected = waves.find(w => w._id === waveId);
    if (selected) {
      setWave(selected);
    }
  };

  if (loading)
    return <p className="text-gray-600 animate-pulse">Loading waves...</p>;

  if (!waves.length)
    return <p className="text-gray-500">No waves available.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">
        {sectionText?.yourWavesTitle || "Your Waves"}
      </h2>

      <div className="space-y-3 max-h-[600px] overflow-y-auto p-4">
        {waves.map((wave) => (
          <WaveItem
            key={wave._id}
            wave={wave}
            isPlaying={playingWaveId === wave._id}
            onPlayClick={handlePlayClick}
          />
        ))}
      </div>
    </div>
  );
}