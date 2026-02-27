"use client";

import Input from "@/ui/Input";
import Textarea from "@/ui/Textarea";
import {
    Edit3,
    Globe,
    Info,
    Loader2,
    MapPin,
    Save,
    User,
    X
} from "lucide-react";

export default function ProfileForm({
    photographer,
    handleChange,
    handleSave,
    onCancel,
    saving,
    errors,
    getFullStateName,
    formatCityName,
    originalCity,
    originalState
}) {
    // City এবং State উভয়ই অপরিবর্তনীয়
    const isCityImmutable = originalCity && originalCity.length > 0;
    const isStateImmutable = originalState && originalState.length > 0;

    return (
        <div className="space-y-6">
            {/* Form Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Edit3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                </div>
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="space-y-6">
                    <Input
                        label="Full Name"
                        name="name"
                        value={photographer.name}
                        onChange={handleChange}
                        icon={<User className="w-4 h-4" />}
                        placeholder="Enter your full name"
                        required
                        error={errors.name}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* State - সম্পূর্ণ Disabled */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={getFullStateName(photographer.state) + ` (${photographer.state})`}
                                    disabled
                                    className="w-full bg-gray-100 text-gray-700 px-10 py-3 rounded-xl border border-gray-300 cursor-not-allowed opacity-75"
                                />
                            </div>
                            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                        </div>

                        {/* City - সম্পূর্ণ Disabled */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={formatCityName(photographer.city)}
                                    disabled
                                    className="w-full bg-gray-100 text-gray-700 px-10 py-3 rounded-xl border border-gray-300 cursor-not-allowed opacity-75"
                                />
                            </div>
                            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                        </div>
                    </div>

                    {/* Location Immutable Notice */}
                    {(isStateImmutable || isCityImmutable) && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 ">
                                <span className="flex items-center gap-2 font-semibold "><Info /> Location cannot be changed</span>
                                State and City are fixed after profile creation.
                            </p>
                        </div>
                    )}

                    {/* Service Area Display */}
                    {photographer.state && photographer.city && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Service Area:</span><br />
                                {getFullStateName(photographer.state)} ({photographer.state}) • {formatCityName(photographer.city)}
                            </p>
                        </div>
                    )}

                    <Textarea
                        label="Biography"
                        name="biography"
                        value={photographer.biography}
                        onChange={handleChange}
                        placeholder="Tell clients about your photography style, experience, specialties..."
                        rows={6}
                        icon={<Edit3 className="w-4 h-4" />}
                    />

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving || !photographer.name}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}