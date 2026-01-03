import InfoCard from "@/ui/InfoCard";
import { Building2, Clock, Edit3, ImageIcon, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";

const OverviewTab = ({ venue, previewImages, subscriptionPlan }) => (
    <div className="space-y-8">
        {/* Verification Status */}
        {!venue.isActive && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Clock className="text-yellow-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-yellow-400 font-semibold">Pending Verification</h4>
                        <p className="text-yellow-300/80 text-sm">
                            Your venue is under review. You'll receive a verification color code once approved.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Users size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {venue.seating || "0"}
                        </p>
                        <p className="text-gray-400">Seating Capacity</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                        <MapPin size={24} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white capitalize">
                            {venue.city || "—"}
                        </p>
                        <p className="text-gray-400">Location</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${subscriptionPlan === "pro" ? "bg-yellow-500/20" : "bg-gray-700"}`}>
                        <Clock size={24} className={subscriptionPlan === "pro" ? "text-yellow-400" : "text-gray-400"} />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-white truncate">
                            {venue.openHours || "—"}
                        </p>
                        <p className="text-gray-400">Open Hours</p>
                        {subscriptionPlan === "free" && !venue.openHours && (
                            <p className="text-xs text-gray-500 mt-1">Pro feature</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Venue Details */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Building2 size={24} />
                    Venue Information
                </h3>

                <div className="space-y-6">
                    <InfoCard
                        icon={<Star className="text-yellow-400" size={20} />}
                        label="Venue Name"
                        value={venue.name}
                    />
                    <InfoCard
                        icon={<MapPin className="text-red-400" size={20} />}
                        label="Address"
                        value={venue.address}
                    />
                    <InfoCard
                        icon={<Users className="text-blue-400" size={20} />}
                        label="Seating Capacity"
                        value={venue.seating ? `${venue.seating} people` : "—"}
                    />
                    <InfoCard
                        icon={<Clock className="text-green-400" size={20} />}
                        label="Open Hours"
                        value={venue.openHours || "Not set"}
                        isProFeature={!venue.openHours}
                    />
                </div>

                {/* Biography Section */}
                {venue.biography && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Edit3 size={18} />
                            About Venue
                        </h4>
                        <p className="text-gray-300 leading-relaxed bg-gray-800/50 rounded-lg p-4">
                            {venue.biography}
                        </p>
                    </div>
                )}
            </div>

            {/* Photos Gallery */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ImageIcon size={24} />
                    Venue Photos
                    {previewImages.length > 0 && (
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium ml-2">
                            {previewImages.length}
                        </span>
                    )}
                </h3>

                {previewImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                        {previewImages.map((src, idx) => (
                            <div
                                key={idx}
                                className="relative aspect-square rounded-xl overflow-hidden group border border-gray-600"
                            >
                                <Image
                                    src={src}
                                    alt={`Venue photo ${idx + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-2">
                                    <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        Photo {idx + 1}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
                        <ImageIcon size={48} className="text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No photos uploaded</p>
                        <p className="text-gray-500 text-sm">
                            {subscriptionPlan === "pro"
                                ? "Add photos in the Edit Profile section"
                                : "Photo uploads available in Pro plan"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default OverviewTab;