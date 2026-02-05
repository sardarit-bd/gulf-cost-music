import { ImageIcon } from "lucide-react";
import Image from "next/image";

export default function PortfolioTab({
  studio,
  setSelectedPhoto,
  setShowPhotoModal,
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6">Studio Portfolio</h3>

      {studio.photos && studio.photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studio.photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setSelectedPhoto(index);
                setShowPhotoModal(true);
              }}
            >
              <Image
                src={photo.url}
                alt={`Studio photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <div className="font-semibold">Photo {index + 1}</div>
                  <div className="text-sm opacity-80">Click to view larger</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon size={64} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 text-lg">
            No portfolio photos available.
          </p>
        </div>
      )}
    </div>
  );
}
