"use client";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";

export default function FeaturedSection() {
  return (
    <section className="py-16 px-6 md:px-16 bg-[#F9FAFB]">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Image */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-400">
          <div className="relative w-full h-[560px] rounded-2xl overflow-hidden">
            <Image
              src="/images/Featured.jpg"
              alt="Beach Live Show"
              fill
              className="object-cover"
            />
          </div>

          {/* Streaming Badge */}
          <div className="text-center absolute bottom-4 left-4  shadow-md rounded-md px-3 py-4 text-sm font-semibold">
            <span className="text-gray-800">259+</span><br />
            <span className="text-gray-500">Streaming</span>
          </div>

          {/* Hits Badge */}
          <div className="text-center absolute top-4 right-4  shadow-md rounded-md px-6 py-3 text-sm font-semibold">
            <span className="text-gray-800">100+</span><br />
            <span className="text-gray-500">Hits</span>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <p className="uppercase tracking-wide text-gray-500 text-sm font-semibold mb-2">
            About Gulf Coast Music
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Catch The Hottest Live Shows On The Gulf Coast
          </h2>

          <p className="text-gray-600 mb-6">
            From intimate jazz nights to high-energy rock concerts — explore the
            best upcoming live music events across the Gulf Coast. Filter by
            city, artist, or venue and never miss a beat.
          </p>

          <ul className="space-y-3">
            <li className="flex items-start">
              <FaCalendarAlt className="w-5 h-5 text-green-600 mt-1 mr-2" />
              <span className="text-gray-500">
                <b className="text-black">Live Event Calendar</b> → Browse shows
                by date, genre, and location.
              </span>
            </li>

            <li className="flex items-start">
              <FaUserFriends className="w-5 h-5 text-green-600 mt-1 mr-2" />
              <span className="text-gray-500">
                <b className="text-black">Featured Artists</b> → Discover
                talented musicians shaping the Gulf Coast sound.
              </span>
            </li>

            <li className="flex items-start">
              <FaMapMarkerAlt className="w-5 h-5 text-green-600 mt-1 mr-2" />
              <span className="text-gray-500">
                <b className="text-black">Top Venues</b> → Explore iconic spots
                where music comes alive.
              </span>
            </li>

            <li className="flex items-start">
              <FaTicketAlt className="w-5 h-5 text-green-600 mt-1 mr-2" />
              <span className="text-gray-500">
                <b className="text-black">Easy Ticket Access</b> → One-click
                links to buy tickets online.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
