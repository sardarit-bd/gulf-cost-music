// components/journalist/ProfileTab.js
import Select from "@/ui/Select";
import {
  Camera,
  CheckCircle,
  Mail,
  MapPin,
  Save,
  Upload,
  User2,
} from "lucide-react";
import Image from "next/image";

const stateOptions = [
  { value: "", label: "Select State" },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Alabama", label: "Alabama" },
  { value: "Florida", label: "Florida" },
];

const cityByState = {
  Louisiana: [
    { value: "new orleans", label: "New Orleans" },
    { value: "baton rouge", label: "Baton Rouge" },
    { value: "lafayette", label: "Lafayette" },
    { value: "shreveport", label: "Shreveport" },
    { value: "lake charles", label: "Lake Charles" },
    { value: "monroe", label: "Monroe" },
  ],
  Mississippi: [
    { value: "jackson", label: "Jackson" },
    { value: "biloxi", label: "Biloxi" },
    { value: "gulfport", label: "Gulfport" },
    { value: "oxford", label: "Oxford" },
    { value: "hattiesburg", label: "Hattiesburg" },
  ],
  Alabama: [
    { value: "birmingham", label: "Birmingham" },
    { value: "mobile", label: "Mobile" },
    { value: "huntsville", label: "Huntsville" },
    { value: "tuscaloosa", label: "Tuscaloosa" },
  ],
  Florida: [
    { value: "tampa", label: "Tampa" },
    { value: "st. petersburg", label: "St. Petersburg" },
    { value: "clearwater", label: "Clearwater" },
    { value: "pensacola", label: "Pensacola" },
    { value: "panama city", label: "Panama City" },
    { value: "fort myers", label: "Fort Myers" },
  ],
};

const formatCityName = (city) => {
  if (!city) return "";
  return city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ProfileTab({
  journalist,
  previewAvatar,
  selectedCoverageAreas,
  onAvatarUpload,
  onJournalistChange,
  onProfileStateChange,
  onSaveProfile,
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 mx-auto mb-4">
                {previewAvatar ? (
                  <Image
                    src={previewAvatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                      e.target.className =
                        "w-full h-full bg-gray-200 flex items-center justify-center";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User2 size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-sm">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onAvatarUpload}
                />
              </label>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {journalist.fullName || "Your Name"}
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              {journalist.email || "Journalist"}
            </p>

            {/* Verification Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${journalist.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                  }`}
              >
                {journalist.isVerified ? (
                  <>
                    <CheckCircle size={14} />
                    Verified Journalist
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    Not Verified
                  </>
                )}
              </span>
              {!journalist.isVerified && (
                <p className="text-xs text-gray-500 mt-1">
                  Email thegulfcoastmusic@gmail.com for verification
                </p>
              )}
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
              <Upload size={16} /> Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onAvatarUpload}
              />
            </label>

            {/* Location Info */}
            {(journalist.state || journalist.city) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Location
                </h4>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <MapPin size={14} />
                  <span>
                    {journalist.city && formatCityName(journalist.city)}
                    {journalist.city && journalist.state && ", "}
                    {journalist.state}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User2 size={20} className="text-gray-700" />
            Profile Information
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                value={journalist.fullName}
                onChange={(e) =>
                  onJournalistChange({
                    ...journalist,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                value={journalist.email}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Select
                  name="state"
                  value={journalist.state}
                  options={stateOptions}
                  onChange={(e) => onProfileStateChange(e.target.value)}
                  placeholder="Select State"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Select
                  name="city"
                  value={journalist.city}
                  options={
                    journalist.state && cityByState[journalist.state]
                      ? [
                        { value: "", label: "Select City" },
                        ...cityByState[journalist.state],
                      ]
                      : [{ value: "", label: "Select State First" }]
                  }
                  onChange={(e) =>
                    onJournalistChange({
                      ...journalist,
                      city: e.target.value,
                    })
                  }
                  disabled={!journalist.state}
                  placeholder={
                    journalist.state ? "Select City" : "Select State First"
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                rows={4}
                value={journalist.bio}
                onChange={(e) =>
                  onJournalistChange({
                    ...journalist,
                    bio: e.target.value,
                  })
                }
                placeholder="Tell us about yourself, your experience, and your focus areas..."
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition resize-vertical"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={onSaveProfile}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
              >
                <Save size={18} /> Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
