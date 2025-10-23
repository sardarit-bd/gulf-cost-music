"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ArtistGallery() {
  const artists = [
    { id: 1, name: "Vibe Artist 1", image: "/images/fevartistImage.webp" },
    { id: 2, name: "Vibe Artist 2", image: "/images/fevartistImage.webp" },
    { id: 3, name: "Vibe Artist 3", image: "/images/fevartistImage.webp" },
    { id: 4, name: "Vibe Artist 4", image: "/images/fevartistImage.webp" },
    { id: 5, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 6, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 7, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 8, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 9, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 10, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 11, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
    { id: 12, name: "Vibe Artist 5", image: "/images/fevartistImage.webp" },
  ];

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
            1920: { slidesPerView:  5},
          }}
          className="pb-10"
        >
          {artists.map((artist) => (
            <SwiperSlide key={artist.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-[320px]">
                <div className="relative">
                  <img
                    src={artist.image}
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
        Read more
      </button>
      </div>
    </section>
  );
}
