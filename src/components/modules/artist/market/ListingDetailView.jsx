import { Edit2, FileText, ImageIcon, MapPin, Trash2, Video } from "lucide-react";

export function ListingDetailView({
    existingItem,
    selectedImageIndex,
    setSelectedImageIndex,
    onEditListing,
    onDeleteListing,
    stats,
}) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
            {/* <ListingStatusBadge status={existingItem.status} createdAt={existingItem.createdAt} /> */}

            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Price */}
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold text-gray-900">
                                    {existingItem.title}
                                </h2>
                                {existingItem.location && (
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200">
                                        <MapPin size={16} />
                                        {existingItem.location}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-right">
                                    <div className="text-sm text-gray-600 mb-1">Listed Price</div>
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ${existingItem.price}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Media */}
                        <div className="space-y-6">
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-xl">
                                {existingItem.photos?.[selectedImageIndex] ? (
                                    <img
                                        src={existingItem.photos[selectedImageIndex]}
                                        alt={existingItem.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-20 h-20 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="text-sm text-gray-900 font-medium">
                                        {selectedImageIndex + 1} / {existingItem.photos?.length || 1}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {existingItem.photos && existingItem.photos.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {existingItem.photos.map((photo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border-3 transition-all duration-300 ${selectedImageIndex === index
                                                ? "border-blue-500"
                                                : "border-gray-200 hover:border-blue-300"
                                                }`}
                                        >
                                            <img
                                                src={photo}
                                                alt={`${existingItem.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                                    <FileText className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Description</h3>
                            </div>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                    {existingItem.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Action Card */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-xl">
                                <h4 className="text-xl font-bold text-gray-900 mb-8">
                                    Manage Listing
                                </h4>
                                <div className="space-y-4">
                                    <button
                                        onClick={onEditListing}
                                        className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-4"
                                    >
                                        <div className="p-2.5 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                                            <Edit2 className="w-6 h-6" />
                                        </div>
                                        <span className="text-lg">Edit Listing</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this listing?")) {
                                                onDeleteListing();
                                            }
                                        }}
                                        className="group w-full bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-semibold py-4 rounded-xl hover:bg-red-100 border border-red-200 transition-all duration-300 flex items-center justify-center gap-4"
                                    >
                                        <div className="p-2.5 bg-red-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                            <Trash2 className="w-6 h-6" />
                                        </div>
                                        <span className="text-lg">Delete Listing</span>
                                    </button>
                                </div>
                            </div>

                            {/* Video Section */}
                            {existingItem.videos?.length > 0 && (
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Video className="w-6 h-6 text-purple-600" />
                                        <h4 className="text-lg font-semibold text-gray-900">Listing Video</h4>
                                    </div>
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-300">
                                        <video
                                            src={existingItem.videos[0]}
                                            controls
                                            preload="metadata"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}