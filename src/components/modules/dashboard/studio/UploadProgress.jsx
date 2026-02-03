"use client";

import { Loader2 } from "lucide-react";

export default function UploadProgress({ progress }) {
    return (
        <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <div className="flex-1">
                    <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">Uploading...</span>
                        <span className="font-bold text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-600">
                Please don't close this window while uploading...
            </p>
        </div>
    );
}