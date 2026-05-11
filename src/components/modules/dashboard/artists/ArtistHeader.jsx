"use client";

import { Music } from "lucide-react";

const ArtistHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Music className="w-5 h-5 text-white" />
          </div>
          Artist Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage artist profiles, subscription plans, activate/deactivate
          accounts
        </p>
      </div>
    </div>
  );
};

export default ArtistHeader;
