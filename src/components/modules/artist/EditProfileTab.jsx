import SaveButton from "./SaveButton";
import UpgradePrompt from "./UpgradePrompt";
import UploadSection from "./UploadSection";

const genreOptions = [
    "Pop", "Rock", "Rap", "Country", "Jazz",
    "Reggae", "EDM", "Classical", "Other"
];

const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

export default function EditProfileTab({
    artist,
    previewImages = [],  // Add default value
    audioPreview = [],   // Add default value
    subscriptionPlan,
    uploadLimits = { photos: 0, audios: 0 }, // Add default value
    onChange,
    onImageUpload,
    onRemoveImage,
    onAudioUpload,
    onRemoveAudio,
    onSave,
    saving = false
}) {
    // Filter out invalid image URLs
    const validPreviewImages = previewImages.filter(img => {
        if (!img) return false;
        if (typeof img === 'string') {
            return img.trim() !== "" && img !== "undefined" && img !== "null";
        }
        if (typeof img === 'object' && img.url) {
            return img.url.trim() !== "";
        }
        return false;
    });

    return (
        <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                    </label>
                    <input
                        name="name"
                        value={artist?.name || ""}
                        onChange={onChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
                    />
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                    </label>
                    <select
                        name="city"
                        value={artist?.city?.toLowerCase() || ""}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
                    >
                        <option value="">Select City</option>
                        {cityOptions.map((city) => (
                            <option key={city} value={city.toLowerCase()}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Genre */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Genre *
                    </label>
                    <select
                        name="genre"
                        value={artist?.genre?.toLowerCase() || ""}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
                    >
                        <option value="">Select Genre</option>
                        {genreOptions.map((g) => (
                            <option key={g} value={g.toLowerCase()}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Biography */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Biography
                        {subscriptionPlan === "free" && (
                            <span className="text-yellow-500 text-xs ml-2">(Pro feature)</span>
                        )}
                    </label>
                    <textarea
                        name="biography"
                        value={artist?.biography || ""}
                        onChange={onChange}
                        rows={4}
                        placeholder={subscriptionPlan === "free"
                            ? "Upgrade to Pro to add biography..."
                            : "Write a short biography about yourself and your music..."
                        }
                        className={`w-full px-4 py-3 rounded-lg text-white border placeholder-gray-400 outline-none resize-vertical transition ${subscriptionPlan === "free"
                            ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-700 border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                            }`}
                        disabled={subscriptionPlan === "free"}
                    />
                    {subscriptionPlan === "free" && <UpgradePrompt feature="Biography" />}
                </div>
            </div>

            {/* Upload Sections */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Photos Upload */}
                <div>
                    <UploadSection
                        type="image"
                        label="Upload Photos"
                        accept="image/*"
                        maxFiles={uploadLimits.photos || 0}
                        currentFiles={validPreviewImages.map((img, idx) => {
                            const url = typeof img === 'string' ? img : img.url;
                            return {
                                url: url,
                                id: idx,
                                name: `Photo ${idx + 1}`
                            };
                        })}
                        onUpload={onImageUpload}
                        onRemove={onRemoveImage}
                        subscriptionPlan={subscriptionPlan}
                        disabled={subscriptionPlan !== "pro"}
                    />
                </div>

                {/* Audio Upload */}
                <div>
                    <UploadSection
                        type="audio"
                        label="Upload Audio"
                        accept="audio/*"
                        maxFiles={uploadLimits.audios || 0}
                        currentFiles={audioPreview.filter(audio =>
                            audio && (
                                typeof audio === 'string' ?
                                    audio.trim() !== "" :
                                    audio.url && audio.url.trim() !== ""
                            )
                        )}
                        onUpload={onAudioUpload}
                        onRemove={onRemoveAudio}
                        subscriptionPlan={subscriptionPlan}
                        disabled={subscriptionPlan !== "pro"}
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
                <SaveButton onClick={onSave} saving={saving} />
            </div>
        </div>
    );
}