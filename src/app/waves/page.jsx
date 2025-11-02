import FeaturedWave from "@/components/modules/waves/featured-wave";
import WavesFavoritesList from "@/components/modules/waves/waves-favorites-list";

export default function WavesSection() {
  return (
    <main
      style={{
        background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-10">
        {/* Left Column - Favorites */}
        <div className="lg:col-span-1">
          <WavesFavoritesList />
        </div>

        {/* Right Column - Featured Wave */}
        <div className="lg:col-span-2">
          <FeaturedWave />
        </div>
      </div>
    </main>
  );
}
