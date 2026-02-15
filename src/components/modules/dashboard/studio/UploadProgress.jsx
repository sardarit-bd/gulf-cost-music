// components/modules/dashboard/studio/UploadProgress.jsx
"use client";

import { CheckCircle, Loader2 } from "lucide-react";

export default function UploadProgress({ progress }) {
  const isComplete = progress === 100;

  return (
    <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          )}
          <span className="font-medium text-gray-900">
            {isComplete ? "Upload Complete!" : "Uploading..."}
          </span>
        </div>
        <span className="font-bold text-blue-600">{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            isComplete
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-600 mt-3">
        {isComplete
          ? "Files uploaded successfully! Redirecting..."
          : "Please wait while your files are being uploaded"}
      </p>
    </div>
  );
}
