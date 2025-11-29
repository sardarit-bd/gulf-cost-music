import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import {
    Edit3,
    Loader2,
    MapPin,
    Save,
    User
} from "lucide-react";

export default function EditProfileTab({
    photographer,
    cityOptions,
    handleChange,
    handleSave,
    saving,
}) {
    return (
        <div className="animate-fadeIn">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Edit3 size={20} />
                            Profile Details
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Photographer Name *"
                                name="name"
                                value={photographer.name}
                                onChange={handleChange}
                                icon={<User size={18} />}
                                placeholder="Enter your full name"
                            />
                            <Select
                                label="City *"
                                name="city"
                                value={photographer.city}
                                options={cityOptions}
                                onChange={handleChange}
                                icon={<MapPin size={18} />}
                            />
                            <div className="md:col-span-2">
                                <Textarea
                                    label="Biography"
                                    name="biography"
                                    value={photographer.biography}
                                    onChange={handleChange}
                                    icon={<Edit3 size={18} />}
                                    placeholder="Tell us about your photography experience, style, specialties, and what makes your work unique..."
                                    rows={6}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Only Actions Now */}
                <div className="space-y-6">
                    {/* Profile Stats */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Profile Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Photos Uploaded:</span>
                                <span className="font-semibold text-yellow-400">
                                    {photographer.photos?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Services:</span>
                                <span className="font-semibold text-yellow-400">
                                    {photographer.services?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Videos:</span>
                                <span className="font-semibold text-yellow-400">
                                    {photographer.videos?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button
                                disabled={saving}
                                onClick={handleSave}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}