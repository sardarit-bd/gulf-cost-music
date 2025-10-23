"use client";

import Image from "next/image";
import { FiPlay } from "react-icons/fi";

export default function WaveItem({ wave }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] shadow hover:shadow-md transition-all cursor-pointer group">
      <div className="relative shrink-0">
        <Image
          src={wave.image || "/placeholder.svg"}
          alt={wave.title}
          width={120}
          height={120}
          className="rounded-md object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <FiPlay className="text-white text-lg" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-black truncate">{wave.title}</h3>
        <p className="text-sm text-gray-700">{wave.category}</p>
      </div>
    </div>
  );
}
