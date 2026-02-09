// components/venue/VenuePhotosGallery.js
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VenuePhotosGallery({ previewImages, venueName }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon size={24} className="text-gray-700" />
          Venue Photos
          {previewImages.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium ml-2">
              {previewImages.length}
            </span>
          )}
        </h3>
        <Link
          href="/dashboard/venues/edit-profile"
          className="text-sm text-blue-600 hover:text-blue-800 transition font-medium"
        >
          Manage Photos
        </Link>
      </div>

      {previewImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {previewImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200"
            >
              <Image
                src={src}
                alt={`${venueName} photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/300/300";
                  e.target.className =
                    "w-full h-full bg-gray-100 flex items-center justify-center";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-2">
                <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded text-xs">
                  Photo {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <ImageIcon size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No photos uploaded</p>
          <p className="text-gray-500 text-sm mb-4">
            Add photos in the Edit Profile section
          </p>
          <Link
            href="/dashboard/venues/edit-profile"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            <ImageIcon size={16} />
            Upload Photos
          </Link>
        </div>
      )}
    </div>
  );
}
