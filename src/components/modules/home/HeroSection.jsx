"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hero-video`);
      const data = await res.json();
      setHero(data.data);
    };

    fetchHeroData();
  }, []);

  return (
    <section className="relative w-full h-screen bg-cover bg-center pt-16 overflow-hidden">

      {/* Background Video */}
      {hero?.videoUrl && (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {hero?.title || "Welcome to Gulf Coast Music"}
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-8">
          {hero?.subtitle || "Experience the best performances."}
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
