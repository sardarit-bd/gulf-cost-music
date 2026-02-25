"use client";

import { Play } from "lucide-react";
import VideoPreview from "./VideoPreview";
import { useState, useEffect } from "react";

export default function HeroPreview({ heroData }) {
    const [currentWord, setCurrentWord] = useState(0);

    // Flash text effect for preview
    useEffect(() => {
        if (!heroData.animationSettings?.isEnabled) return;

        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % (heroData.flashWords?.length || 1));
        }, heroData.animationSettings?.interval || 1500);

        return () => clearInterval(interval);
    }, [heroData.flashWords, heroData.animationSettings]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Live Preview
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-6 border-2 border-dashed border-gray-200 relative min-h-[500px]">
                {/* Content */}
                <div className="text-center space-y-4 mb-6 relative z-10">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {heroData.title || "Welcome to Gulf Coast Music"}
                    </h1>

                    <p className="text-base text-gray-600 leading-relaxed">
                        {heroData.subtitlePrefix || "Experience the best with stunning"}{" "}
                        {heroData.animationSettings?.isEnabled ? (
                            <span
                                className="font-bold inline-block min-w-[100px] transition-all duration-300"
                                style={{
                                    color: heroData.animationSettings?.textColor || "#FBBF24",
                                    animation: 'fadeInOut 1.5s ease-in-out',
                                }}
                            >
                                {heroData.flashWords?.[currentWord] || "Artists"}
                            </span>
                        ) : (
                            <span className="font-bold text-yellow-500">
                                {heroData.flashWords?.[0] || "Artists"}
                            </span>
                        )}
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

                {/* Video Preview */}
                <VideoPreview videoUrl={heroData.videoUrl} />

                {/* Bottom Right Text Box */}
                {heroData.bottomText?.isVisible && (
                    <div className="absolute bottom-4 right-4 z-20">
                        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border-l-4 border-yellow-400 shadow-xl">
                            <p className="text-white text-xs md:text-sm font-medium">
                                <span className="text-yellow-400 font-bold">
                                    {heroData.bottomText?.artistName || "Anna E. Westcoat"}
                                </span>
                                <span className="text-gray-300 mx-1">
                                    {heroData.bottomText?.separator || "-"}
                                </span>
                                <span className="text-white italic">
                                    "{heroData.bottomText?.songName || "Gulf County"}"
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes fadeInOut {
                    0% {
                        opacity: 0.7;
                        transform: scale(0.98);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 0.7;
                        transform: scale(0.98);
                    }
                }
            `}</style>
        </div>
    );
}