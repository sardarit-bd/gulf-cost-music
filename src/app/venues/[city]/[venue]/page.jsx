"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VenueProfile() {
  const { city, venue: venueId } = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState(null);


  useEffect(() => {
    const fetchVenue = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/${venueId}`);
      const data = await res.json();
      if (res.ok) setVenue(data.data.venue);
    };
    fetchVenue();
  }, [venueId]);

  if (!venue) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">Venue Not Found 😢</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="brandBg min-h-screen text-white mt-12">
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={venue.photos?.[0]?.url || "/default.jpg"}
          alt={venue.venueName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>
        <div className="container relative mx-auto h-full flex flex-col md:flex-row md:items-end md:justify-start justify-end bottom-10 left-10">
          <div className="flex gap-3 items-end">
            <div className="border-3 border-yellow-400 w-[170px] rounded-md  h-[200px]">
              <Image
                src={venue.photos?.[0]?.url || "/default.jpg"}
                alt={venue.venueName}
                width={1000}
                height={1000}
                className="object-cover h-full w-full"
              />
            </div>
            <div>
              <h1 className="md:text-5xl text-3xl font-bold text-[var(--primary)]">{venue.venueName}</h1>
              <p className="text-gray-300 mt-2">{venue.city}</p>
            </div>
          </div>

        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
          <p className="text-lg text-gray-300 leading-relaxed">
            {venue.biography}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-300 mt-8">
            <div>📍 Address: {venue.address}</div>
            <div>🏟 Capacity: {venue.seatingCapacity}</div>
            <div>🕓 Hours: {venue.openHours}</div>
          </div>

          <div className="pt-10">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
