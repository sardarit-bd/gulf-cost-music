"use client"
import FeaturedWave from "@/components/modules/waves/featured-wave";
import WavesFavoritesList from "@/components/modules/waves/waves-favorites-list";
import { useEffect, useState } from "react";

export default function WavesSection() {
  const [selectedWave, setSelectedWave] = useState(null);
  const [playingWaveId, setPlayingWaveId] = useState(null);
  const [sectionText, setSectionText] = useState({
    sectionTitle: "Waves",
    sectionSubtitle: "Explore the freshest waves and top audio experiences.",
    yourWavesTitle: "Your Waves"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

        // Fetch both waves and section text
        const [wavesRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/waves`),
          fetch(`${API_BASE}/api/wave-settings`) // Correct endpoint for settings
        ]);

        // Process waves data
        const wavesData = await wavesRes.json();
        if (wavesData.success && Array.isArray(wavesData.data?.waves)) {
          if (wavesData.data.waves.length > 0 && !selectedWave) {
            setSelectedWave(wavesData.data.waves[0]);
          }
        }

        // Process settings data
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.data) {
          setSectionText({
            sectionTitle: settingsData.data.sectionTitle || "Waves",
            sectionSubtitle: settingsData.data.sectionSubtitle || "Explore the freshest waves and top audio experiences.",
            yourWavesTitle: settingsData.data.yourWavesTitle || "Your Waves"
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
        }}
        className="py-16 px-6 md:px-16 mt-20"
      >
        <div className="container mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading waves content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
      }}
      className="py-16 px-6 md:px-16 mt-20"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Favorites */}
        <div className="lg:col-span-1">
          <WavesFavoritesList
            setWave={setSelectedWave}
            playingWaveId={playingWaveId}
            setPlayingWaveId={setPlayingWaveId}
            sectionText={sectionText}
          />
        </div>

        {/* Right Column - Featured Wave */}
        <div className="lg:col-span-2">
          <FeaturedWave
            wave={selectedWave}
            sectionText={sectionText}
            setPlayingWaveId={setPlayingWaveId}
          />
        </div>
      </div>
    </div>
  );
}