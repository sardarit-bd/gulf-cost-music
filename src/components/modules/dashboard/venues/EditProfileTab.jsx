import { Building2, Clock, Edit3, Globe, ImageIcon, Loader2, MapPin, Phone, Save, Trash2, Users } from "lucide-react";
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
    handleChange,
    handleImageUpload,
    removeImage,
    previewImages,
    handleSave,
    saving,
}) => {
    // State options - Location-based categorization
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

        if (name === "state") {
            setVenueData(prev => ({
                ...prev,
                [name]: value,
                city: "" // Reset city when state changes
            }));
        } else {
            setVenueData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Custom handleSave to use venueData
    const handleCustomSave = async () => {
        // Validation
        if (!venueData.venueName.trim()) {
            alert("Venue name is required");
            return;
        }

        if (!venueData.state) {
            alert("State is required");
            return;
        }

        if (!venueData.city) {
            alert("City is required");
            return;
        }

        // Validate state-city combination
        const stateCities = STATE_CITY_MAPPING[venueData.state] || [];
        if (!stateCities.includes(venueData.city.toLowerCase())) {
            alert(`"${venueData.city}" is not a valid city for "${venueData.state}". Please select a valid city from the dropdown.`);
            return;
        }

        // Prepare data for backend with ALL features enabled
        const saveData = {
            venueName: venueData.venueName.trim(),
            state: venueData.state,
            city: venueData.city.toLowerCase(),
            address: venueData.address.trim(),
            seatingCapacity: parseInt(venueData.seatingCapacity) || 0,
            biography: venueData.biography.trim(),
            openHours: venueData.openHours.trim(),
            openDays: venueData.openDays.trim(),
            phone: venueData.phone.trim(),
            website: venueData.website.trim(),
            // Location-based categorization info
            locationCategory: venueData.state,
        };

        // Call parent's handleSave with updated data
        if (handleSave) {
            await handleSave(saveData);
        }
    };

    // Format city display name
    const formatCityDisplay = (city) => {
        if (!city) return "";
        return city.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Handle image upload (ALWAYS ENABLED for all users)
    const handleImageUploadAllUsers = (e) => {
        if (previewImages.length >= 10) {
            alert(`You have reached the maximum number of photos (10).`);
            return;
        }

        if (handleImageUpload) {
            handleImageUpload(e);
        }
    };

    return (
        <div className="space-y-8">
            {/* Location Categorization Info */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                        <MapPin className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-blue-400 font-semibold mb-2">Location-Based Categorization</h4>
                        <p className="text-gray-300 text-sm mb-3">
                            Your venue will appear under <strong className="text-yellow-400">{venueData.state || "Selected State"}</strong> category
                            on the homepage "Venues" tab. Choose your state and city carefully!
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                                <p className="text-xs text-gray-400">Louisiana</p>
                                <p className="text-sm font-medium text-white">New Orleans, Baton Rouge</p>
                            </div>
                            <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                                <p className="text-xs text-gray-400">Mississippi</p>
                                <p className="text-sm font-medium text-white">Jackson, Biloxi</p>
                            </div>
                            <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                                <p className="text-xs text-gray-400">Alabama</p>
                                <p className="text-sm font-medium text-white">Birmingham, Mobile</p>
                            </div>
                            <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                                <p className="text-xs text-gray-400">Florida</p>
                                <p className="text-sm font-medium text-white">Tampa, Pensacola</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit3 size={20} />
                                Venue Details
                            </h3>
                            <div className="text-xs text-gray-400">
                                All fields are editable
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* State (Required) - For categorization */}
                            <Select
                                label="State *"
                                name="state"
                                value={venueData.state}
                                options={stateOptions}
                                onChange={handleVenueChange}
                                icon={<MapPin size={18} />}
                                disabled={saving}
                                required
                                helperText="This determines your category on the homepage"
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
                                placeholder={venueData.state ? "Select a city" : "Select state first"}
                                required
                                customDisplay={venueData.city ? formatCityDisplay(venueData.city) : ""}
                                helperText={`Available cities in ${venueData.state}`}
                            />

                            {/* Current Location Display */}
                            {venueData.state && venueData.city && (
                                <div className="md:col-span-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-300 mb-1">
                                                <span className="font-medium">Selected Location:</span>{" "}
                                                <span className="text-yellow-400">
                                                    {formatCityDisplay(venueData.city)}, {venueData.state}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Your venue will appear under <strong className="text-green-400">{venueData.state}</strong> category
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs ${STATE_CITY_MAPPING[venueData.state]?.includes(venueData.city.toLowerCase())
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-red-500/20 text-red-400"}`}>
                                            {STATE_CITY_MAPPING[venueData.state]?.includes(venueData.city.toLowerCase())
                                                ? "✓ Valid Location"
                                                : "✗ Invalid Location"}
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    helperText="This is your primary display name"
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
                                    disabled={saving}
                                    placeholder="Enter venue address"
                                    helperText="Full address for visitors"
                                />
                            </div>

                            {/* Phone */}
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={venueData.phone}
                                onChange={handleVenueChange}
                                icon={<Phone size={18} />}
                                disabled={saving}
                                placeholder="Enter phone number"
                                helperText="Contact number for bookings"
                            />

                            {/* Website */}
                            <Input
                                label="Website"
                                name="website"
                                value={venueData.website}
                                onChange={handleVenueChange}
                                icon={<Globe size={18} />}
                                disabled={saving}
                                placeholder="https://example.com"
                                helperText="Your venue's website or social media"
                            />

                            {/* Seating Capacity */}
                            <Input
                                label="Seating Capacity"
                                name="seatingCapacity"
                                type="number"
                                value={venueData.seatingCapacity}
                                onChange={handleVenueChange}
                                icon={<Users size={18} />}
                                disabled={saving}
                                min="0"
                                placeholder="Enter seating capacity"
                                helperText="Maximum number of guests"
                            />

                            {/* Open Hours */}
                            <Input
                                label="Open Hours"
                                name="openHours"
                                value={venueData.openHours}
                                onChange={handleVenueChange}
                                icon={<Clock size={18} />}
                                disabled={saving}
                                placeholder="e.g., 6 PM - 2 AM"
                                helperText="Regular operating hours"
                            />

                            {/* Open Days */}
                            <Input
                                label="Open Days"
                                name="openDays"
                                value={venueData.openDays}
                                onChange={handleVenueChange}
                                icon={<Clock size={18} />}
                                disabled={saving}
                                placeholder="e.g., Mon-Sat, Closed Sunday"
                                helperText="Days of operation"
                            />

                            {/* Biography */}
                            <div className="md:col-span-2">
                                <Textarea
                                    key={venueData.biography}
                                    label="Biography"
                                    name="biography"
                                    value={venueData.biography}
                                    onChange={handleVenueChange}
                                    icon={<Edit3 size={18} />}
                                    disabled={saving}
                                    placeholder="Tell us about your venue, history, specialties, types of shows you host..."
                                    rows={4}
                                    helperText="Describe your venue to attract more visitors"
                                />

                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Photo Upload Section - COMPLETELY FREE */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ImageIcon size={20} />
                                Venue Photos ({previewImages.length}/10)
                            </h3>
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                Available for All
                            </span>
                        </div>

                        <label
                            className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl transition ${previewImages.length >= 10
                                ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "border-green-400/50 bg-green-400/10 text-green-400 hover:bg-green-400/20 cursor-pointer"
                                }`}
                        >
                            <ImageIcon size={32} />
                            <span className="text-sm font-medium text-center">
                                {previewImages.length >= 10
                                    ? "Maximum 10 Photos Uploaded"
                                    : "Upload Venue Photos"}
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                                Maximum 10 photos allowed • JPG, PNG
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleImageUploadAllUsers}
                                disabled={previewImages.length >= 10 || saving}
                            />
                        </label>

                        {previewImages.length > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm text-gray-400">Uploaded Photos ({previewImages.length}/10):</p>
                                    <p className="text-xs text-green-400">
                                        {10 - previewImages.length} photos remaining
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {previewImages.map((src, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 group"
                                        >
                                            <Image
                                                src={src}
                                                alt={`Venue photo ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                            <button
                                                onClick={() => removeImage(i)}
                                                disabled={saving}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* <div className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                            <p className="text-xs text-green-300 mb-2">✅ Photo Upload Features:</p>
                            <ul className="text-xs text-gray-300 space-y-1">
                                <li>• Available to all users for free</li>
                                <li>• Upload up to 10 high-quality photos</li>
                                <li>• Supported formats: JPG, PNG</li>
                                <li>• Show interior, exterior, and stage areas</li>
                            </ul>
                        </div> */}
                    </div>

                    {/* Location Categorization Card */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin size={18} />
                            Location Listing
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
                                <p className="text-sm text-blue-300 mb-1">📍 Your Listing Category</p>
                                <p className="text-2xl font-bold text-yellow-400 text-center">
                                    {venueData.state || "Select State"}
                                </p>
                                <p className="text-xs text-gray-300 mt-2 text-center">
                                    Users will find you under this category on the homepage
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${venueData.state ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-xs text-gray-300">State Selected</span>
                                    </div>
                                    <span className="text-xs font-medium">
                                        {venueData.state || "Not selected"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${venueData.city ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-xs text-gray-300">City Selected</span>
                                    </div>
                                    <span className="text-xs font-medium">
                                        {venueData.city ? formatCityDisplay(venueData.city) : "Not selected"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Profile Button */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Save Your Profile</h3>
                        <button
                            disabled={saving || !venueData.venueName || !venueData.state || !venueData.city}
                            onClick={handleCustomSave}
                            className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-primary/80 text-black py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving Profile...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Venue Profile
                                </>
                            )}
                        </button>

                        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-300 mb-2">Profile Completion:</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Venue Name:</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${venueData.venueName
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"}`}>
                                        {venueData.venueName ? "✓ Set" : "Required"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Location:</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${venueData.state && venueData.city
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"}`}>
                                        {venueData.state && venueData.city ? "✓ Set" : "Required"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Photo Uploads:</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${previewImages.length > 0
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-blue-500/20 text-blue-400"}`}>
                                        {previewImages.length}/10 photos
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileTab;