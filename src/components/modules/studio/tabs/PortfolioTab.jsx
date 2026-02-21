import { Grid, ImageIcon, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PortfolioTab({
  studio,
  setSelectedPhoto,
  setShowPhotoModal,
}) {
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Studio Gallery</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition ${viewMode === "grid"
                ? "bg-yellow-500 text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition ${viewMode === "list"
                ? "bg-yellow-500 text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {studio.photos && studio.photos.length > 0 ? (
        viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {studio.photos.map((photo, index) => (
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
                  alt={`Studio ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-sm">View</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {studio.photos.map((photo, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-800/30 rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition"
                onClick={() => {
                  setSelectedPhoto(index);
                  setShowPhotoModal(true);
                }}
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={photo.url}
                    alt={`Studio ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Photo {index + 1}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Click to view full size
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <ImageIcon size={48} className="mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No portfolio photos available.</p>
        </div>
      )}
    </div>
  );
}