// components/modules/dashboard/photographer/ProfileForm.jsx
"use client";

import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import {
    Edit3,
    Globe,
    Loader2,
    MapPin,
    Save,
    User,
    X
} from "lucide-react";

export default function ProfileForm({
    photographer,
    setPhotographer,
    stateOptions,
    cityOptions,
    handleChange,
    handleStateChange,
    isCityDisabled,
    handleSave,
    onCancel,
    saving,
    errors,
    getFullStateName,
    formatCityName
}) {
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
                        <Select
                            label="State"
                            name="state"
                            value={photographer.state}
                            options={stateOptions}
                            onChange={handleStateChange}
                            icon={<Globe className="w-4 h-4" />}
                            required
                            error={errors.state}
                            disabled={isCityDisabled}
                            placeholder="LA, MS, AL, or FL"
                        />

                        <Select
                            label="City"
                            name="city"
                            value={photographer.city}
                            options={cityOptions}
                            onChange={handleChange}
                            icon={<MapPin className="w-4 h-4" />}
                            required
                            disabled={!photographer.state || isCityDisabled()}
                            error={errors.city}
                        />
                    </div>

                    {/* City Immutable Notice */}
                    {photographer.state && isCityDisabled() && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                            <p className="text-sm text-yellow-700">
                                <span className="font-semibold">Note:</span> City cannot be changed after profile creation.
                            </p>
                        </div>
                    )}

                    {/* Service Area Display */}
                    {photographer.state && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <p className="text-sm text-blue-700">
                                <span className="font-semibold">Service Area:</span>{' '}
                                {getFullStateName(photographer.state)} ({photographer.state})
                                {photographer.city && (
                                    <> • {formatCityName(photographer.city)}</>
                                )}
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
                            disabled={saving || !photographer.name || !photographer.state || !photographer.city}
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