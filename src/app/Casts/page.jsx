import FavoritesList from "@/components/modules/Casts/favorites-list"
import FeaturedCast from "@/components/modules/Casts/featured-cast"

export default function CastsSection() {
  return (
    <main
      className=""
      style={{
        background: "linear-gradient(to bottom, #F9FAFB 0%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-10">
        {/* Left Column - Favorites */}
        <div className="lg:col-span-1">
          <FavoritesList />
        </div>

        {/* Right Column - Featured Cast */}
        <div className="lg:col-span-2">
          <FeaturedCast />
        </div>
      </div>
    </main>
  )
}
