"use client"
import FavoritesList from "@/components/modules/Casts/favorites-list";
import FeaturedCast from "@/components/modules/Casts/featured-cast";
import { useEffect, useState } from "react";

export default function CastsSection() {
  const [cast, setCast] = useState(null);
  const [allCasts, setAllCasts] = useState([]);
  const [sectionText, setSectionText] = useState({
    sectionTitle: "Cast",
    sectionSubtitle: "Tune into engaging podcast episodes featuring your favorite personalities",
    yourCastsTitle: "Your Favorites"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const [castsRes, sectionTextRes] = await Promise.all([
          fetch(`${API_BASE}/api/casts`, { cache: "no-store" }),
          fetch(`${API_BASE}/api/casts/section/text`, { cache: "no-store" })
        ]);

        // Casts data
        const castsData = await castsRes.json();
        if (castsRes.ok && castsData.success && Array.isArray(castsData.data.casts)) {
          setAllCasts(castsData.data.casts);
          if (castsData.data.casts.length > 0 && !cast) {
            setCast(castsData.data.casts[0]);
          }
        }

        // Section text data
        const sectionTextData = await sectionTextRes.json();
        if (sectionTextRes.ok && sectionTextData.success) {
          setSectionText({
            sectionTitle: sectionTextData.data.sectionTitle || "Cast",
            sectionSubtitle: sectionTextData.data.sectionSubtitle || "Tune into engaging podcast episodes featuring your favorite personalities",
            yourCastsTitle: sectionTextData.data.yourCastsTitle || "Your Favorites"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="py-16 px-6 md:px-16 mt-20"
        style={{
          background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
        }}
      >
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-[400px] bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-16 px-6 md:px-16 mt-20"
      style={{
        background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Favorites */}
        <div className="lg:col-span-1">
          <FavoritesList
            setCast={setCast}
            activeCast={cast}
            sectionText={sectionText}
          />
        </div>

        {/* Right Column - Featured Cast */}
        <div className="lg:col-span-2">
          <FeaturedCast
            cast={cast}
            sectionText={sectionText}
          />
        </div>
      </div>
    </div>
  );
}