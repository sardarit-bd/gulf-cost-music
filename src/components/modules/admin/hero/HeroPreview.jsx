"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeroButtonPreview from "./HeroButtonPreview";

export default function HeroPreview({ heroData }) {
    const [currentWord, setCurrentWord] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef(null);

    // Flash text effect for preview
    useEffect(() => {
        if (!heroData.animationSettings?.isEnabled) return;

        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % (heroData.flashWords?.length || 1));
        }, heroData.animationSettings?.interval || 1500);

        return () => clearInterval(interval);
    }, [heroData.flashWords, heroData.animationSettings]);

    const getVideoUrl = (videoUrl) => {
        if (!videoUrl) return null;
        // If it's a Cloudinary public_id
        if (!videoUrl.includes('http') && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be')) {
            return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto/${videoUrl}.mp4`;
        }
        return videoUrl;
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVideoError = () => {
        setVideoError(true);
        console.error("Video failed to load:", videoUrl);
    };

    const flashColor = heroData.animationSettings?.textColor || "#FBBF24";
    const videoUrl = getVideoUrl(heroData.videoUrl);
    const isYouTubeVideo = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                Live Preview
            </h2>

            {/* Hero Section Preview - Exact same as HeroSection */}
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                {/* Background Video */}
                {heroData.videoUrl && !videoError ? (
                    isYouTubeVideo ? (
                        // YouTube Embed
                        <div className="absolute inset-0 w-full h-full">
                            <iframe
                                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                src={`${videoUrl.replace('watch?v=', 'embed/').split('&')[0]}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoUrl.split('v=')[1]?.split('&')[0] || ''}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                                frameBorder="0"
                                allow="autoplay; encrypted-media; fullscreen"
                                allowFullScreen
                                title="Hero Background Video"
                            ></iframe>
                        </div>
                    ) : (
                        // Direct Video File
                        <video
                            ref={videoRef}
                            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            key={videoUrl}
                            onError={handleVideoError}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )
                ) : (
                    // Fallback Background
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900"></div>
                )}

                {/* Overlay - Slightly darker for better text visibility */}
                <div className="absolute inset-0 bg-black/40 z-0"></div>

                {/* Mute/Unmute Button - Only visible when video exists */}
                {heroData.videoUrl && !videoError && (
                    <button
                        onClick={toggleMute}
                        className="absolute bottom-4 left-4 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer"
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                        {heroData.title || "Welcome to Gulf Coast Music"}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-base md:text-lg text-gray-200 mb-6">
                        <span className="text-gray-200 font-medium">
                            For local:
                        </span>

                        <HeroButtonPreview
                            words={heroData.flashWords || ["Artists", "Venues", "Photographers", "Studios", "Journalists"]}
                            textColor={flashColor}
                        />
                    </div>

                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-lg font-bold transition text-sm shadow-lg cursor-pointer">
                        {heroData.buttonText || "Get Started"}
                    </button>
                </div>

                {/* Bottom Right Text Box */}
                {heroData.bottomText?.isVisible && (
                    <div className="absolute bottom-4 right-4 z-20">
                        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border-l-4 border-yellow-500 shadow-xl">
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
            {heroData.videoUrl && !videoError && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 text-xs flex items-center justify-center gap-1">
                        <Play className="w-3 h-3" />
                        Background video is active {!isMuted && "(Sound ON)"}
                    </p>
                </div>
            )}

            {/* Video Error Message */}
            {videoError && (
                <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-700 text-xs flex items-center justify-center gap-1">
                        ⚠️ Video failed to load. Please check the video URL.
                    </p>
                </div>
            )}
        </div>
    );
}