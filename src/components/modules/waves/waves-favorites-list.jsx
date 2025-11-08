"use client";
import { useEffect, useState } from "react";
import WaveItem from "./wave-item";


export default function WavesFavoritesList({ setWave }) {
  const [waves, setWaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchWaves = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/waves`, { cache: "no-store" });
        const data = await res.json();
        console.log("🌊 Fetched Wave Data:", data);

        if (res.ok && data.success && Array.isArray(data.data.waves)) {
          setWaves(data.data.waves);
          setWave(data.data.waves[0])
        } else {
          console.warn("⚠️ No valid wave data found");
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

  if (loading)
    return <p className="text-gray-600 animate-pulse">Loading waves...</p>;

  if (!waves.length)
    return <p className="text-gray-500">No waves available.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Your Waves</h2>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {waves.map((wave) => (
          <div key={wave._id} onClick={() => setWave(wave)}>
            <WaveItem key={wave._id} wave={wave} />
          </div>
        ))}
      </div>
    </div>
  );
}
