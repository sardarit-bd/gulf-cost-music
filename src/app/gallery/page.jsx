"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArtistGallery() {
  const [Artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/artists`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data.artists)) {
          setArtists(data.data.artists);
          setLoading(false)
        } else {
          console.warn("⚠️ No valid podcast data found");
          setArtists([]);
        }
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading)
    return <p className="text-gray-600 animate-pulse">Loading podcasts...</p>;

  return (
    <section className="bg-gray-50 px-6 md:px-16 text-center mt-10">
      <div className="container mx-auto">
        {/* Section header */}
        <p className="uppercase tracking-widest text-sm text-gray-500 font-semibold">
          Our Gallery
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          Watch Your Favourite Artist
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          Venenatis cras sed felis eget velit aliquet sagittis. Facilisis gravida neque convallis a cras semper auctor neque.
        </p>

        {/* Swiper Gallery */}

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1400: { slidesPerView: 5 },
              1600: { slidesPerView: 5 },
              1920: { slidesPerView: 5 },
            }}
            className="pb-10"
          >
            {Artists.map((artist) => (
              <SwiperSlide key={artist?._id}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-[320px]">
                  <div className="relative">
                    <img
                      src={artist?.photos[0]?.url}
                      alt={artist.name}
                      className="w-full object-cover h-[320px]"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Read More Button */}
        <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-md transition">
          <Link href={'/artists'}>See More</Link>
        </button>
      </div>
    </section>
  );
}
