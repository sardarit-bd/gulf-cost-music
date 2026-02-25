"use client";

import CustomLoader from "@/components/shared/loader/Loader";
import { Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [hero, setHero] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setHero(data.data);
        } else {
          console.error("API Error:", data.message);
          // Set default data if API fails
          setHero({
            title: "Welcome to Gulf Coast Music",
            subtitlePrefix: "Experience the best with stunning",
            flashWords: ["Artists", "Venues", "Photographers", "Studios", "Journalists"],
            buttonText: "Get Started",
            videoUrl: null,
            videoPublicId: null,
            bottomText: {
              artistName: "Anna E. Westcoat",
              songName: "Gulf County",
              separator: "-",
              isVisible: true
            },
            animationSettings: {
              interval: 1500,
              textColor: "#FBBF24",
              isEnabled: true
            }
          });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        // Set default data on error
        setHero({
          title: "Welcome to Gulf Coast Music",
          subtitlePrefix: "Experience the best with stunning",
          flashWords: ["Artists", "Venues", "Photographers", "Studios", "Journalists"],
          buttonText: "Get Started",
          videoUrl: null,
          videoPublicId: null,
          bottomText: {
            artistName: "Anna E. Westcoat",
            songName: "Gulf County",
            separator: "-",
            isVisible: true
          },
          animationSettings: {
            interval: 1500,
            textColor: "#FBBF24",
            isEnabled: true
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Flash text effect
  useEffect(() => {
    if (!hero?.animationSettings?.isEnabled || !hero?.flashWords?.length) return;

    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % hero.flashWords.length);
    }, hero.animationSettings.interval || 1500);

    return () => clearInterval(interval);
  }, [hero?.flashWords, hero?.animationSettings?.interval, hero?.animationSettings?.isEnabled]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20 bg-white">
        <div className="text-center">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  const videoUrl = getVideoUrl(hero?.videoUrl);
  const flashColor = hero?.animationSettings?.textColor || "#FBBF24";
  const currentFlashWord = hero?.flashWords?.[currentWord] || hero?.flashWords?.[0] || "Artists";
  const isYouTubeVideo = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  return (
    <section className="relative w-full h-screen bg-cover bg-center pt-16 overflow-hidden">
      {/* Background Video */}
      {videoUrl ? (
        isYouTubeVideo ? (
          // YouTube Embed with mute/unmute support
          <iframe
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover -z-10 scale-105 pointer-events-none"
            src={`${videoUrl.replace('watch?v=', 'embed/').split('&')[0]}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoUrl.split('v=')[1]?.split('&')[0] || ''}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="Hero Background Video"
          ></iframe>
        ) : (
          // Direct Video File (Cloudinary or direct URL)
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            key={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        // Fallback Background
        <div
          className="absolute top-0 left-0 w-full h-full object-cover -z-10 bg-gradient-to-br from-blue-900 to-purple-900"
        ></div>
      )}

      {/* Overlay - Slightly darker for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Mute/Unmute Button */}
      {videoUrl && (
        <button
          onClick={toggleMute}
          className="absolute bottom-7 left-8 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {hero?.title || "Welcome to Gulf Coast Music"}
        </h1>

        {/* Subtitle with Flash Text */}
        <p className="text-xl md:text-2xl lg:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed">
          {hero?.subtitlePrefix || "Experience the best with stunning"}{" "}
          {hero?.animationSettings?.isEnabled ? (
            <span key={currentWord} className="flash-wrapper">
  <span className="flash-lg">
    <span
      className="flash-sl"
      style={{ backgroundColor: flashColor }}
    ></span>
    <span className="flash-text">
      {currentFlashWord}
    </span>
  </span>
</span>
          ) : (
            <span className="font-bold" style={{ color: flashColor }}>
              {currentFlashWord}
            </span>
          )}
        </p>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500/90 transition text-lg shadow-lg">
          <Link href="/venues">
            {hero?.buttonText || "Get Started"}
          </Link>
        </button>
      </div>

      {/* Bottom Right Text Box - Anna E. Westcoat - "Gulf County" */}
      {hero?.bottomText?.isVisible && (
        <div className="absolute bottom-8 right-8 z-20">
          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-lg border-l-4 border-yellow-400 shadow-xl">
            <p className="text-white text-sm md:text-base font-medium">
              <span className="text-yellow-400 font-bold">
                {hero.bottomText.artistName || "Anna E. Westcoat"}
              </span>
              <span className="text-gray-300 mx-2">
                {hero.bottomText.separator || "-"}
              </span>
              <span className="text-white italic">
                "{hero.bottomText.songName || "Gulf County"}"
              </span>
            </p>
          </div>
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
    </section>
  );
}