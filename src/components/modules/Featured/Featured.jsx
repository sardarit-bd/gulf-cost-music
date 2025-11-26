// components/FeaturedSection.js
"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUserFriends,
} from "react-icons/fa";

// Icon mapping
const iconComponents = {
  calendar: FaCalendarAlt,
  users: FaUserFriends,
  location: FaMapMarkerAlt,
  ticket: FaTicketAlt
};

export default function FeaturedSection() {
  const { user } = useAuth();
  const [featuredData, setFeaturedData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch featured section data
  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

      const res = await fetch(`${API_BASE}/api/featured-section`);
      const data = await res.json();

      if (data.success) {
        setFeaturedData(data.data);
      } else {
        // Fallback to defaults
        setFeaturedData({
          title: "Catch The Hottest Live Shows On The Gulf Coast",
          subtitle: "About Gulf Coast Music",
          description: "From intimate jazz nights to high-energy rock concerts — explore the best upcoming live music events across the Gulf Coast. Filter by city, artist, or venue and never miss a beat.",
          listItems: [
            {
              icon: "calendar",
              title: "Live Event Calendar",
              text: "Browse shows by date, genre, and location.",
            },
            {
              icon: "users",
              title: "Featured Artists",
              text: "Discover talented musicians shaping the Gulf Coast sound.",
            },
            {
              icon: "location",
              title: "Top Venues",
              text: "Explore iconic spots where music comes alive.",
            },
            {
              icon: "ticket",
              title: "Easy Ticket Access",
              text: "One-click links to buy tickets online.",
            },
          ],
          // streamsCount: 259,
          // hitsCount: 100,
          imageUrl: "/images/Featured.jpg"
        });
      }
    } catch (error) {
      console.error("Error fetching featured data:", error);
      // Fallback to defaults
      setFeaturedData({
        title: "Catch The Hottest Live Shows On The Gulf Coast",
        subtitle: "About Gulf Coast Music",
        description: "From intimate jazz nights to high-energy rock concerts — explore the best upcoming live music events across the Gulf Coast. Filter by city, artist, or venue and never miss a beat.",
        listItems: [
          {
            icon: "calendar",
            title: "Live Event Calendar",
            text: "Browse shows by date, genre, and location.",
          },
          {
            icon: "users",
            title: "Featured Artists",
            text: "Discover talented musicians shaping the Gulf Coast sound.",
          },
          {
            icon: "location",
            title: "Top Venues",
            text: "Explore iconic spots where music comes alive.",
          },
          {
            icon: "ticket",
            title: "Easy Ticket Access",
            text: "One-click links to buy tickets online.",
          },
        ],
        streamsCount: 259,
        hitsCount: 100,
        imageUrl: "/images/Featured.jpg"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  // // Admin settings button
  // const AdminSettingsButton = () => {
  //   if (user?.role !== 'admin') return null;

  //   return (
  //     <div className="absolute top-6 right-6 z-10">
  //       <Link
  //         href="/dashboard/admin/featured-section"
  //         className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg hover:bg-white transition-colors border border-gray-300 shadow-sm"
  //       >
  //         <Settings className="w-4 h-4" />
  //         Customize
  //       </Link>
  //     </div>
  //   );
  // };

  if (loading || !featuredData) {
    return (
      <section className="py-16 px-6 md:px-16 bg-[#F9FAFB]">
        <div className="container mx-auto flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-48 mx-auto rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-16 bg-[#F9FAFB] relative">
      {/* <AdminSettingsButton /> */}

      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Image */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="relative w-full h-[560px] rounded-2xl overflow-hidden">
            <Image
              src={featuredData.imageUrl || "/images/Featured.jpg"}
              alt="Beach Live Show"
              fill
              className="object-cover"
            />
          </div>

          {/* Streaming Badge
          <div className="bg-white text-center absolute bottom-4 left-4 shadow-md rounded-md px-3 py-4 text-sm font-semibold">
            <span className="text-gray-800">{featuredData.streamsCount}+</span><br />
            <span className="text-gray-500">Streaming</span>
          </div>

          Hits Badge
          <div className="bg-white text-center absolute top-4 right-4 shadow-md rounded-md px-6 py-3 text-sm font-semibold">
            <span className="text-gray-800">{featuredData.hitsCount}+</span><br />
            <span className="text-gray-500">Hits</span>
          </div> */}
        </div>

        {/* Right Content */}
        <div>
          <p className="uppercase tracking-wide text-gray-500 text-sm font-semibold mb-2">
            {featuredData.subtitle}
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {featuredData.title}
          </h2>

          <p className="text-gray-600 mb-6">
            {featuredData.description}
          </p>

          <ul className="space-y-3">
            {featuredData.listItems.map((item, index) => {
              const IconComponent = iconComponents[item.icon] || FaCalendarAlt;
              return (
                <li key={index} className="flex items-start">
                  <IconComponent className="w-5 h-5 text-yellow-400 mt-1 mr-2" />
                  <span className="text-gray-500">
                    <b className="text-black">{item.title}</b> → {item.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}