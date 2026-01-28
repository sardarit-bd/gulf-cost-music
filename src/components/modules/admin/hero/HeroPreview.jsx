"use client";

import { Play } from "lucide-react";
import VideoPreview from "./VideoPreview";

export default function HeroPreview({ heroData }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Live Preview
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-6 border-2 border-dashed border-gray-200">
                <div className="text-center space-y-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {heroData.title || "Your Hero Title"}
                    </h1>
                    <p className="text-base text-gray-600 leading-relaxed">
                        {heroData.subtitle ||
                            "Your compelling subtitle will appear here"}
                    </p>
                    <button className="bg-yellow-500 text-black px-6 py-2 rounded-md font-medium transition-all inline-flex items-center gap-1 text-sm">
                        {heroData.buttonText || "Get Started"}
                    </button>
                    {heroData.videoUrl && (
                        <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                            <p className="text-green-700 text-xs flex items-center justify-center gap-1">
                                <Play className="w-3 h-3" />
                                Background video is active
                            </p>
                        </div>
                    )}
                </div>

                {/* Video Preview with Fallback */}
                <VideoPreview videoUrl={heroData.videoUrl} />
            </div>
        </div>
    );
}