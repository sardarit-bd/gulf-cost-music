import { Building2, Clock, Crown, Edit3, Globe, ImageIcon, Loader2, MapPin, Phone, Save, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

const STATE_CITY_MAPPING = {
    'Louisiana': ['new orleans', 'baton rouge', 'lafayette', 'shreveport', 'lake charles', 'monroe'],
    'Mississippi': ['jackson', 'biloxi', 'gulfport', 'oxford', 'hattiesburg'],
    'Alabama': ['birmingham', 'mobile', 'huntsville', 'tuscaloosa'],
    'Florida': ['tampa', 'st. petersburg', 'clearwater', 'pensacola', 'panama city', 'fort myers']
};

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
}) => {
    // State options
    const stateOptions = [
        { value: "Louisiana", label: "Louisiana" },
        { value: "Mississippi", label: "Mississippi" },
        { value: "Alabama", label: "Alabama" },
        { value: "Florida", label: "Florida" }
    ];

    // Get cities based on selected state
    const getCityOptions = () => {
        if (!venueData.state) return [];

        const cities = STATE_CITY_MAPPING[venueData.state] || [];

        // Format cities for dropdown - Capitalize for display
        return cities.map(city => ({
            value: city.toLowerCase(),
            label: city.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        }));
    };

    // Initialize venue data with backend structure
    const [venueData, setVenueData] = useState({
        venueName: venue?.venueName || venue?.name || "",
        state: venue?.state || "Alabama",
        city: venue?.city || "mobile",
        address: venue?.address || "",
        seatingCapacity: venue?.seatingCapacity || venue?.seating || 0,
        biography: venue?.biography || "",
        openHours: venue?.openHours || "",
        openDays: venue?.openDays || "",
        phone: venue?.phone || "",
        website: venue?.website || "",
    });

    // Update venueData when venue prop changes
    useEffect(() => {
        if (venue) {
            setVenueData({
                venueName: venue.venueName || venue.name || "",
                state: venue.state || "Alabama",
                city: venue.city || "mobile",
                address: venue.address || "",
                seatingCapacity: venue.seatingCapacity || venue.seating || 0,
                biography: venue.biography || "",
                openHours: venue.openHours || "",
                openDays: venue.openDays || "",
                phone: venue.phone || "",
                website: venue.website || "",
            });
        }
    }, [venue]);

    // Custom handleChange for venueData
    const handleVenueChange = (e) => {
        const { name, value } = e.target;

        // If state changes, reset city
        if (name === "state") {
            setVenueData(prev => ({
                ...prev,
                [name]: value,
                city: ""
            }));
        } else {
            setVenueData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Also call parent's handleChange if provided
        if (handleChange) {
            handleChange(e);
        }
    };

    // Custom handleSave to use venueData
    const handleCustomSave = async () => {
        // Prepare data for backend
        const saveData = {
            venueName: venueData.venueName,
            state: venueData.state,
            city: venueData.city.toLowerCase(),
            address: venueData.address,
            seatingCapacity: parseInt(venueData.seatingCapacity) || 0,
            biography: venueData.biography,
            openHours: venueData.openHours,
            openDays: venueData.openDays,
            phone: venueData.phone,
            website: venueData.website,
        };

        // Call parent's handleSave with updated data
        if (handleSave) {
            await handleSave(saveData);
        }
    };

    return (
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
                                <li>• Limited venue details editing</li>
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
                            {/* State (Required) */}
                            <Select
                                label="State *"
                                name="state"
                                value={venueData.state}
                                options={stateOptions}
                                onChange={handleVenueChange}
                                icon={<MapPin size={18} />}
                                disabled={saving}
                                required
                            />

                            {/* City (Required) */}
                            <Select
                                label="City *"
                                name="city"
                                value={venueData.city}
                                options={getCityOptions()}
                                onChange={handleVenueChange}
                                icon={<MapPin size={18} />}
                                disabled={!venueData.state || saving}
                                placeholder={venueData.state ? "Select city" : "Select state first"}
                                required
                            />

                            {/* Venue Name */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Venue Name *"
                                    name="venueName"
                                    value={venueData.venueName}
                                    onChange={handleVenueChange}
                                    icon={<Building2 size={18} />}
                                    disabled={saving}
                                    required
                                    placeholder="Enter venue name"
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Address"
                                    name="address"
                                    value={venueData.address}
                                    onChange={handleVenueChange}
                                    icon={<MapPin size={18} />}
                                    disabled={subscriptionPlan === "free" || saving}
                                    placeholder={subscriptionPlan === "free" ? "Pro feature - Upgrade to add address" : "Enter venue address"}
                                />
                            </div>

                            {/* Phone */}
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={venueData.phone}
                                onChange={handleVenueChange}
                                icon={<Phone size={18} />}
                                disabled={subscriptionPlan === "free" || saving}
                                placeholder={subscriptionPlan === "free" ? "Pro feature" : "Enter phone number"}
                            />

                            {/* Website */}
                            <Input
                                label="Website"
                                name="website"
                                value={venueData.website}
                                onChange={handleVenueChange}
                                icon={<Globe size={18} />}
                                disabled={subscriptionPlan === "free" || saving}
                                placeholder={subscriptionPlan === "free" ? "Pro feature" : "https://example.com"}
                            />

                            {/* Seating Capacity */}
                            <Input
                                label="Seating Capacity"
                                name="seatingCapacity"
                                type="number"
                                value={venueData.seatingCapacity}
                                onChange={handleVenueChange}
                                icon={<Users size={18} />}
                                disabled={subscriptionPlan === "free" || saving}
                                min="0"
                                placeholder={subscriptionPlan === "free" ? "Pro feature" : "Enter seating capacity"}
                            />

                            {/* Open Hours */}
                            <Input
                                label="Open Hours"
                                name="openHours"
                                value={venueData.openHours}
                                onChange={handleVenueChange}
                                icon={<Clock size={18} />}
                                disabled={subscriptionPlan === "free" || saving}
                                placeholder={subscriptionPlan === "free" ? "Pro feature - Upgrade to edit" : "e.g., 6 PM - 2 AM"}
                            />

                            {/* Open Days */}
                            <Input
                                label="Open Days"
                                name="openDays"
                                value={venueData.openDays}
                                onChange={handleVenueChange}
                                icon={<Clock size={18} />}
                                disabled={subscriptionPlan === "free" || saving}
                                placeholder={subscriptionPlan === "free" ? "Pro feature" : "e.g., Mon-Sat, Closed Sunday"}
                            />

                            {/* Biography */}
                            <div className="md:col-span-2">
                                <Textarea
                                    label="Biography"
                                    name="biography"
                                    value={venueData.biography}
                                    onChange={handleVenueChange}
                                    icon={<Edit3 size={18} />}
                                    disabled={subscriptionPlan === "free" || saving}
                                    placeholder={subscriptionPlan === "free" ? "Pro feature - Upgrade to add biography" : "Tell us about your venue, history, specialties..."}
                                    rows={4}
                                />
                                {subscriptionPlan === "free" && !venueData.biography && (
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
                            disabled={saving || !venueData.venueName || !venueData.state || !venueData.city}
                            onClick={handleCustomSave}
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

                        {/* Required fields notice */}
                        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-300 mb-1">Required fields:</p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    <span>Venue Name</span>
                                </li>
                                <li className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    <span>State</span>
                                </li>
                                <li className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    <span>City</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileTab;