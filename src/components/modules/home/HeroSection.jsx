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
        const data = await res.json();
        setHero(data.data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube URL handling
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";

      // Handle different YouTube URL formats
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0];
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3`;
      }
    }

    // Direct MP4 video URL
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return url;
    }

    return null;
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative w-full h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  const embedUrl = getEmbedUrl(hero?.videoUrl);

  return (
    <section className="relative w-full h-screen bg-cover bg-center pt-16 overflow-hidden">
      {/* Background Video */}
      {embedUrl ? (
        embedUrl.includes("youtube.com") ? (
          // YouTube Embed
          <iframe
            className="absolute top-0 left-0 w-full h-full object-cover -z-10 scale-105"
            src={embedUrl}
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="Hero Background Video"
          ></iframe>
        ) : (
          // Direct Video File
          <video
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={embedUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        // Fallback Background Image
        <div
          className="absolute top-0 left-0 w-full h-full object-cover -z-10 bg-gradient-to-br from-blue-900 to-purple-900"
        ></div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {hero?.title || "Welcome to Gulf Coast Music"}
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-4xl leading-relaxed">
          {hero?.subtitle || "Experience the best with stunning venues and powerful performances."}
        </p>

        <button className="bg-primary text-primary-foreground px-4 py-2 rounded font-bold hover:bg-primary/90 transition text-lg">
          <Link href="/dashboard">
            {hero?.buttonText || "Get Started"}
          </Link>
        </button>
      </div>
    </section>
  );
}