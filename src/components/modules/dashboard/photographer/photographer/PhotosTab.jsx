import {
    ImageIcon,
    Loader2,
    Trash2,
    Upload
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PhotosTab({
    photos,
    removeImage,
    handleImageUpload,
    uploadingPhotos,
    MAX_PHOTOS
}) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Check photo limit
        const totalAfterUpload = photos.length + files.length;
        if (totalAfterUpload > MAX_PHOTOS) {
            toast.error(`You can only upload maximum ${MAX_PHOTOS} photos. You have ${photos.length} already.`);
            return;
        }

        setIsUploading(true);

        try {
            await handleImageUpload(e);
            toast.success(`${files.length} photo(s) uploaded successfully!`);
        } catch (error) {
            console.error("Photo upload error:", error);
            toast.error("Failed to upload photos");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="animate-fadeIn space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ImageIcon size={24} />
                    Portfolio Photos
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium ml-2">
                        {photos.length}/{MAX_PHOTOS}
                    </span>
                </h3>

                {/* Upload Area */}
                <label className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl transition ${photos.length >= MAX_PHOTOS || uploadingPhotos || isUploading
                    ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                    }`}>
                    {uploadingPhotos || isUploading ? (
                        <>
                            <Loader2 size={40} className="animate-spin" />
                            <span className="text-lg font-medium text-center">Uploading Photos...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={40} />
                            <div className="text-center">
                                <p className="text-lg font-medium">
                                    {photos.length >= MAX_PHOTOS ? 'Maximum Photos Reached' : 'Upload Photos'}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Max {MAX_PHOTOS} photos • JPG, PNG, WebP
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleFileUpload}
                                disabled={photos.length >= MAX_PHOTOS || uploadingPhotos || isUploading}
                            />
                        </>
                    )}
                </label>

                {/* Upload Progress */}
                {(uploadingPhotos || isUploading) && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Processing photos...</span>
                    </div>
                )}
            </div>

            {/* Photos Grid */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    Your Photos ({photos.length})
                </h3>

                {photos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
                        <ImageIcon size={48} className="text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No photos uploaded yet</p>
                        <p className="text-gray-500 text-sm">Upload your best work to showcase your skills</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 text-sm mb-4">
                            {photos.length} photo(s) - Click on any photo to remove it
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo._id || index}
                                    className="relative aspect-square rounded-xl overflow-hidden group border border-gray-600 cursor-pointer"
                                    onClick={() => removeImage(index)}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.caption || `Portfolio photo ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                                        <Trash2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {photo.caption && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-sm truncate">
                                                {photo.caption}
                                            </p>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}