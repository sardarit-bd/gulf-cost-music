// components/journalist/NewsListTab.js
import {
  Calendar,
  Eye,
  MapPin,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NewsListTab({
  newsList,
  onViewDetails,
  onEditNews,
  onDeleteNews,
  onCreateNews,
}) {
  const router = useRouter();

  const handleEditClick = (item) => {
    if (onEditNews) {
      onEditNews(item);
    } else {
      router.push(`/dashboard/journalist/edit-news/${item._id}`);
    }
  };

  return (
    <div>
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Newspaper size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {newsList.length}
              </p>
              <p className="text-gray-600">Total News</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-600">Today</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Plus size={24} className="text-yellow-600" />
            </div>
            <div>
              <button
                onClick={onCreateNews}
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                Create News
              </button>
              <p className="text-gray-600">New Story</p>
            </div>
          </div>
        </div>
      </div>

      {newsList.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Newspaper size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No news articles yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by creating your first news story
          </p>
          <button
            onClick={onCreateNews}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
          >
            <Plus size={20} /> Create First News
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {newsList
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Thumbnail */}
                  {item.photos?.length > 0 && (
                    <div
                      className="lg:w-48 lg:h-32 w-full h-48 relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => onViewDetails(item)}
                    >
                      <Image
                        src={item.photos[0].url}
                        alt={item.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all flex items-center justify-center">
                        <Eye
                          size={24}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <h3
                        className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 cursor-pointer"
                        onClick={() => onViewDetails(item)}
                      >
                        {item.title}
                      </h3>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Dynamic Edit Button */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => onDeleteNews(item)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {item.location}
                      </div>
                      {item.credit && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {item.credit}
                        </div>
                      )}
                    </div>

                    <p
                      className="text-gray-700 leading-relaxed line-clamp-3 cursor-pointer"
                      onClick={() => onViewDetails(item)}
                    >
                      {item.description}
                    </p>

                    {item.photos?.length > 1 && (
                      <div className="flex gap-2 mt-3">
                        {item.photos.slice(1, 4).map((p, i) => (
                          <div
                            key={i}
                            className="relative w-12 h-12 rounded border border-gray-300 overflow-hidden cursor-pointer"
                            onClick={() => onViewDetails(item)}
                          >
                            <Image
                              src={p.url}
                              alt={`${i + 1}`}
                              fill
                              className="object-cover hover:scale-110 transition-transform"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder.png";
                              }}
                            />
                          </div>
                        ))}
                        {item.photos.length > 4 && (
                          <div
                            className="w-12 h-12 rounded border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-200 transition"
                            onClick={() => onViewDetails(item)}
                          >
                            +{item.photos.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
