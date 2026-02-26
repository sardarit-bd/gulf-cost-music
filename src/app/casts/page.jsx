"use client"
import FavoritesList from "@/components/modules/Casts/favorites-list";
import FeaturedCast from "@/components/modules/Casts/featured-cast";
import CustomLoader from "@/components/shared/loader/Loader";
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
        // Fix: Use correct endpoint for section text
        const [castsRes, sectionTextRes] = await Promise.all([
          fetch(`${API_BASE}/api/casts`),
          fetch(`${API_BASE}/api/cast-settings`) // Fixed endpoint
        ]);

        // Casts data
        const castsData = await castsRes.json();
        if (castsRes.ok && castsData.success && Array.isArray(castsData.data?.casts)) {
          setAllCasts(castsData.data.casts);
          if (castsData.data.casts.length > 0 && !cast) {
            setCast(castsData.data.casts[0]);
          }
        }

        // Section text data - Fixed: Use correct response structure
        const sectionTextData = await sectionTextRes.json();
        if (sectionTextRes.ok && sectionTextData.success) {
          setSectionText({
            sectionTitle: sectionTextData.data?.sectionTitle || "Cast",
            sectionSubtitle: sectionTextData.data?.sectionSubtitle || "Tune into engaging podcast episodes featuring your favorite personalities",
            yourCastsTitle: sectionTextData.data?.yourCastsTitle || "Your Favorites"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Removed cast dependency to prevent infinite loop

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-white">
        <div className="text-center">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
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