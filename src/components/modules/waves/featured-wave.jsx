"use client";

import Image from "next/image";

export default function FeaturedWave() {
  return (
    <div className="space-y-9">
      {/* Header */}
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">Waves</h2>
        <p className="text-gray-600">
          Experience the rhythm of the Gulf Coast — where music, beaches, and vibes flow together.
        </p>
      </div>

      {/* Main Wave Feature */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        {/* Background Image */}
        <div className="relative h-[500px] w-full">
          <Image
            src="/images/waves-banner.webp"
            alt="Gulf Coast Waves"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              “Tides of Sound” – Live on the Shore | Wave #210
            </h3>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <span>🌊</span>
              <span>LIVE PERFORMANCE</span>
            </div>
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition-colors">
            Watch Performance
          </button>
        </div>
      </div>
    </div>
  );
}
