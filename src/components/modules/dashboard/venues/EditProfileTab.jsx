import { Building2, Clock, Crown, Edit3, ImageIcon, Loader2, MapPin, Save, Trash2, Users } from "lucide-react";
import Image from "next/image";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

const EditProfileTab = ({
    venue,
    cityOptions,
    handleChange,
    handleImageUpload,
    removeImage,
    previewImages,
    handleSave,
    saving,
    subscriptionPlan,
    UpgradePrompt,
}) => (
    <div className="space-y-8">
        {/* Plan Notice */}
        {subscriptionPlan === "free" && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                        <Crown className="text-yellow-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-yellow-400 font-semibold mb-2">Free Plan Limitations</h4>
                        <ul className="text-gray-300 space-y-1 text-sm">
                            <li>• Cannot upload venue photos</li>
                            <li>• Cannot edit biography or open hours</li>
                            <li>• Limited to 1 show per month</li>
                        </ul>
                        <button
                            onClick={() => window.open("/pricing", "_blank")}
                            className="mt-3 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition"
                        >
                            <Crown size={16} />
                            Upgrade to Pro for full features
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Edit3 size={20} />
                        Venue Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Venue Name *"
                            name="name"
                            value={venue.name}
                            onChange={handleChange}
                            icon={<Building2 size={18} />}
                            disabled={saving}
                        />

                        <Select
                            label="City *"
                            name="city"
                            value={venue.city}
                            options={cityOptions}
                            onChange={handleChange}
                            icon={<MapPin size={18} />}
                            disabled={saving}
                        />

                        <div className="md:col-span-2">
                            <Input
                                label="Address *"
                                name="address"
                                value={venue.address}
                                onChange={handleChange}
                                icon={<MapPin size={18} />}
                                disabled={saving}
                            />
                        </div>

                        <Input
                            label="Seating Capacity"
                            name="seating"
                            type="number"
                            value={venue.seating}
                            onChange={handleChange}
                            icon={<Users size={18} />}
                            disabled={saving}
                        />

                        <Input
                            label="Open Hours"
                            name="openHours"
                            value={venue.openHours}
                            onChange={handleChange}
                            icon={<Clock size={18} />}
                            disabled={subscriptionPlan === "free" || saving}
                            placeholder={subscriptionPlan === "free" ? "Pro feature - Upgrade to edit" : "e.g., 6 PM - 2 AM"}
                        />

                        <div className="md:col-span-2">
                            <Textarea
                                label="Biography"
                                name="biography"
                                value={venue.biography}
                                onChange={handleChange}
                                icon={<Edit3 size={18} />}
                                disabled={subscriptionPlan === "free" || saving}
                                placeholder={subscriptionPlan === "free" ? "Pro feature - Upgrade to add biography" : "Tell us about your venue..."}
                            />
                            {subscriptionPlan === "free" && !venue.biography && (
                                <UpgradePrompt feature="Biography" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Photo Upload */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ImageIcon size={20} />
                            Photos ({previewImages.length}/5)
                        </h3>
                        {subscriptionPlan === "free" && (
                            <span className="text-xs text-gray-400">Pro only</span>
                        )}
                    </div>

                    <label
                        className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl transition ${subscriptionPlan === "free"
                            ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                            : previewImages.length >= 5
                                ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 cursor-pointer"
                            }`}
                    >
                        <ImageIcon size={32} />
                        <span className="text-sm font-medium text-center">
                            {subscriptionPlan === "free"
                                ? "Photo Upload (Pro Only)"
                                : previewImages.length >= 5
                                    ? "Maximum Reached"
                                    : "Upload Venue Photos"}
                        </span>
                        <span className="text-xs text-gray-400 text-center">
                            Max 5 photos • JPG, PNG
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleImageUpload}
                            disabled={subscriptionPlan === "free" || previewImages.length >= 5 || saving}
                        />
                    </label>

                    {previewImages.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-3">Preview:</p>
                            <div className="grid grid-cols-3 gap-3">
                                {previewImages.map((src, i) => (
                                    <div
                                        key={i}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 group"
                                    >
                                        <Image
                                            src={src}
                                            alt={`Preview ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                        {subscriptionPlan === "pro" && (
                                            <button
                                                onClick={() => removeImage(i)}
                                                disabled={saving}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {subscriptionPlan === "free" && (
                        <UpgradePrompt feature="Photo uploads" />
                    )}
                </div>

                {/* Save Button */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Save Changes</h3>
                    <button
                        disabled={saving}
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Profile
                            </>
                        )}
                    </button>
                    <p className="text-gray-500 text-xs mt-3 text-center">
                        {subscriptionPlan === "free"
                            ? "Free plan: Only basic details can be saved"
                            : "Pro plan: All details including photos will be saved"}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default EditProfileTab;