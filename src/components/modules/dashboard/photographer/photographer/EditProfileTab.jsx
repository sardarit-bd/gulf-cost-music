"use client";

import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import { Edit3, Loader2, MapPin, Save, User, Crown } from "lucide-react";

// Upgrade Prompt Component
const UpgradePrompt = ({ feature }) => (
    <div className="mt-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="flex items-start gap-3">
            <Crown className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
            <div>
                <p className="text-sm text-gray-300">
                    <span className="font-medium">{feature}</span> is available for Pro users
                </p>
                <button
                    onClick={() => window.open("/pricing", "_blank")}
                    className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded font-medium transition"
                >
                    Upgrade to Pro
                </button>
            </div>
        </div>
    </div>
);

export default function EditProfileTab({
    photographer,
    subscriptionPlan,
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
                                required
                            />

                            <Select
                                label="City *"
                                name="city"
                                value={photographer.city}
                                options={cityOptions}
                                onChange={handleChange}
                                icon={<MapPin size={18} />}
                                required
                            />

                            <div className="md:col-span-2">
                                <Textarea
                                    label={
                                        <div className="flex items-center gap-2">
                                            Biography
                                            {subscriptionPlan === "free" && (
                                                <span className="text-yellow-500 text-xs">(Pro feature)</span>
                                            )}
                                        </div>
                                    }
                                    name="biography"
                                    value={photographer.biography}
                                    onChange={handleChange}
                                    icon={<Edit3 size={18} />}
                                    placeholder={
                                        subscriptionPlan === "free"
                                            ? "Upgrade to Pro to add biography..."
                                            : "Tell us about your photography experience, style, specialties, and what makes your work unique..."
                                    }
                                    rows={6}
                                    disabled={subscriptionPlan === "free"}
                                />
                                {subscriptionPlan === "free" && <UpgradePrompt feature="Biography" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Stats */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Profile Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Photos Uploaded:</span>
                                <span className={`font-semibold ${subscriptionPlan === "pro" ? "text-yellow-400" : "text-gray-500"
                                    }`}>
                                    {photographer.photos?.length || 0}
                                    {subscriptionPlan === "pro" ? "/5" : ""}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Services:</span>
                                <span className={`font-semibold ${subscriptionPlan === "pro" ? "text-yellow-400" : "text-gray-500"
                                    }`}>
                                    {photographer.services?.length || 0}
                                    {subscriptionPlan === "pro" ? " services" : ""}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Videos:</span>
                                <span className={`font-semibold ${subscriptionPlan === "pro" ? "text-yellow-400" : "text-gray-500"
                                    }`}>
                                    {photographer.videos?.length || 0}
                                    {subscriptionPlan === "pro" ? "/5" : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button
                                disabled={saving || !photographer.name || !photographer.city}
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

                            {subscriptionPlan === "free" && (
                                <button
                                    onClick={() => window.open("/pricing", "_blank")}
                                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 rounded-lg font-semibold transition"
                                >
                                    <Crown size={16} />
                                    Upgrade to Pro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}