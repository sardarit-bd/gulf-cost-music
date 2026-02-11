"use client";

import { AlertCircle, ImageIcon } from "lucide-react";

export default function PhotoStats({ photos, MAX_PHOTOS }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Photo Stats
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Total Photos</p>
                <p className="text-gray-500 text-sm">Uploaded</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {photos.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">Remaining</p>
              <p className="text-xl font-bold text-green-600">
                {MAX_PHOTOS - photos.length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm">Max Limit</p>
              <p className="text-xl font-bold text-purple-600">{MAX_PHOTOS}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Photo Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Use high-resolution images (minimum 1200px width)</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Include a mix of portrait, landscape, and detail shots</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Optimize file sizes for faster loading</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Add descriptive captions to each photo</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
