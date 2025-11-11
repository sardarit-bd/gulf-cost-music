import { X } from "lucide-react";
import toast from "react-hot-toast";

const PodcastFormFields = ({
    formData,
    formErrors,
    editingItem,
    onFormDataChange,
    onFormErrorsChange,
    onFileChange,
    onClearThumbnail
}) => {

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            onFileChange(file);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                        onFormDataChange({ ...formData, title: e.target.value });
                        onFormErrorsChange({ ...formErrors, title: "" });
                    }}
                    className={`text-gray-700 w-full border rounded-lg px-3 py-2 ${formErrors.title
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                    placeholder="Enter podcast title"
                    required
                />
                {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
            </div>

            {/* YouTube URL */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    YouTube URL *
                </label>
                <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => {
                        onFormDataChange({ ...formData, youtubeUrl: e.target.value });
                        onFormErrorsChange({ ...formErrors, youtubeUrl: "" });
                    }}
                    className={`text-gray-700 w-full border rounded-lg px-3 py-2 ${formErrors.youtubeUrl
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                />
                {formErrors.youtubeUrl && (
                    <p className="mt-1 text-sm text-red-600">
                        {formErrors.youtubeUrl}
                    </p>
                )}
            </div>

            {/* Thumbnail Upload */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Thumbnail Image {!editingItem && "*"}
                </label>

                <div
                    className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${formErrors.thumbnail
                            ? "border-red-400 bg-red-50 hover:bg-red-100"
                            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
                        }`}
                    onClick={() =>
                        document.getElementById("thumbnailInput").click()
                    }
                >
                    {!formData.thumbnail ? (
                        <>
                            <input
                                id="thumbnailInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center space-y-2 text-gray-500">
                                <p className="text-sm font-medium">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-gray-400">
                                    PNG, JPG, or WEBP — Max 5MB (1:1 ratio
                                    recommended)
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="relative group">
                            <img
                                src={
                                    formData.thumbnail instanceof File
                                        ? URL.createObjectURL(formData.thumbnail)
                                        : formData.thumbnail
                                }
                                alt="Preview"
                                className="w-40 h-40 rounded-lg object-cover border border-gray-200 shadow-sm group-hover:opacity-80 transition"
                            />
                            <button
                                type="button"
                                onClick={onClearThumbnail}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow"
                                title="Remove Image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {formErrors.thumbnail && (
                    <p className="text-sm text-red-600 mt-2">
                        {formErrors.thumbnail}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                        onFormDataChange({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    placeholder="Enter podcast description (optional)"
                ></textarea>
            </div>
        </div>
    );
};

export default PodcastFormFields;
