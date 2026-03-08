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

    const flashColor = heroData.animationSettings?.textColor || "#FBBF24";
    const currentFlashWord = heroData.flashWords?.[currentWord] || heroData.flashWords?.[0] || "Artists";

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Live Preview
            </h2>

            {/* Hero Section Preview - Same as actual HeroSection */}
            <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-900 to-purple-900 rounded-md overflow-hidden">
                {/* Video Preview (if any) */}
                {heroData.videoUrl && (
                    <div className="absolute inset-0 w-full h-full">
                        <VideoPreview videoUrl={heroData.videoUrl} />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                )}

                {/* Content - Exact copy from HeroSection */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {heroData.title || "Welcome to Gulf Coast Music"}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
                        {heroData.subtitlePrefix || "Experience the best with stunning"}{" "}
                        {heroData.animationSettings?.isEnabled ? (
                            <span
                                key={currentWord}
                                className="inline-block font-bold"
                                style={{
                                    color: flashColor,
                                    animation: 'fadeInOut 1.5s ease-in-out',
                                }}
                            >
                                {currentFlashWord}
                            </span>
                        ) : (
                            <span className="font-bold" style={{ color: flashColor }}>
                                {currentFlashWord}
                            </span>
                        )}
                    </p>

                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold transition text-base shadow-lg">
                        {heroData.buttonText || "Get Started"}
                    </button>
                </div>

                {/* Bottom Right Text Box - Exact copy from HeroSection */}
                {heroData.bottomText?.isVisible && (
                    <div className="absolute bottom-4 right-4 z-20">
                        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-lg border-l-4 border-yellow-400 shadow-xl">
                            <p className="text-white text-xs md:text-sm font-medium">
                                <span className="text-yellow-400 font-bold">
                                    {heroData.bottomText?.artistName || "Anna E. Westcoat"}
                                </span>
                                <span className="text-gray-300 mx-2">
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

            {/* Video Active Indicator */}
            {heroData.videoUrl && (
                <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                    <p className="text-green-700 text-xs flex items-center justify-center gap-1">
                        <Play className="w-3 h-3" />
                        Background video is active
                    </p>
                </div>
            )}

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