import Image from "next/image";

export default function OverviewTab({
  studio,
  formatPrice,
  setActiveTab,
  setSelectedPhoto,
  setShowPhotoModal,
}) {
  return (
    <div className="space-y-8">
      {/* Biography */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">
          About This Studio
        </h3>
        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
          <p className="text-gray-300 leading-relaxed text-lg">
            {studio.biography || "No biography available for this studio."}
          </p>
        </div>
      </div>

      {/* Services Preview */}
      {studio.services && studio.services.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Popular Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studio.services.slice(0, 4).map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 border border-gray-600 hover:border-yellow-500/30 transition group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-white group-hover:text-yellow-400 transition">
                    {service.service}
                  </div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {formatPrice(service.price)}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Professional studio service
                </div>
              </div>
            ))}
          </div>

          {studio.services.length > 4 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab("services")}
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                View all {studio.services.length} services →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Photo Gallery Preview */}
      {studio.photos && studio.photos.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Studio Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {studio.photos.slice(0, 6).map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setSelectedPhoto(index);
                  setShowPhotoModal(true);
                }}
              >
                <Image
                  src={photo.url}
                  alt={`Studio photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-lg font-semibold">
                    View Photo
                  </div>
                </div>
              </div>
            ))}
          </div>

          {studio.photos.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab("portfolio")}
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                View all {studio.photos.length} photos →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
