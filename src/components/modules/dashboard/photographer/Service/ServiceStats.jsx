// components/modules/dashboard/photographer/ServiceStats.jsx
"use client";

import { Briefcase } from "lucide-react";

export default function ServiceStats({ services }) {
  const photographyCount = services.filter(
    (s) => s.category === "photography",
  ).length;
  const videographyCount = services.filter(
    (s) => s.category === "videography",
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Service Stats
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">Total Services</p>
              <p className="text-gray-500 text-sm">Active listings</p>
            </div>
          </div>
          <span className="text-3xl font-bold text-blue-600">
            {services.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm font-medium">Photography</p>
            <p className="text-blue-900 font-bold text-2xl">
              {photographyCount}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-purple-700 text-sm font-medium">Videography</p>
            <p className="text-purple-900 font-bold text-2xl">
              {videographyCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
