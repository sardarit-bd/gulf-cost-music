"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [hero, setHero] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-video`);

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
            subtitle: "Experience the best with stunning venues and powerful performances.",
            buttonText: "Get Started",
            videoUrl: null
          });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        // Set default data on error
        setHero({
          title: "Welcome to Gulf Coast Music",
          subtitle: "Experience the best with stunning venues and powerful performances.",
          buttonText: "Get Started",
          videoUrl: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const getVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;

    // If it's a Cloudinary public_id
    if (!videoUrl.includes('http') && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be')) {
      return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto/${videoUrl}.mp4`;
    }
    return videoUrl;
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative w-full h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  const videoUrl = getVideoUrl(hero?.videoUrl);

  return (
    <section className="relative w-full h-screen bg-cover bg-center pt-16 overflow-hidden">
      {/* Background Video */}
      {videoUrl ? (
        videoUrl.includes("youtube.com") ? (
          // YouTube Embed
          <iframe
            className="absolute top-0 left-0 w-full h-full object-cover -z-10 scale-105"
            src={videoUrl}
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="Hero Background Video"
          ></iframe>
        ) : (
          // Direct Video File (Cloudinary or direct URL)
          <video
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            autoPlay
            muted
            loop
            playsInline
            key={videoUrl} // Important: force re-render when video changes
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {hero?.title || "Welcome to Gulf Coast Music"}
        </h1>

        <p className="text-xl md:text-2xl lg:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed">
          {hero?.subtitle || "Experience the best with stunning venues and powerful performances."}
        </p>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500/90 transition text-lg">
          <Link href="/venues">
            {hero?.buttonText || "Get Started"}
          </Link>
        </button>
      </div>
    </section>
  );
}