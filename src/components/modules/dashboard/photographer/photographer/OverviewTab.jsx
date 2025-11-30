import InfoCard from "@/ui/InfoCard";
import {
    Briefcase,
    Camera,
    Edit3,
    ImageIcon,
    MapPin,
    Star,
    User,
    Video
} from "lucide-react";
import Image from "next/image";

export default function OverviewTab({ photographer, previewImages }) {
    return (
        <div className="animate-fadeIn space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Briefcase size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{photographer.services?.length || "0"}</p>
                            <p className="text-gray-400">Services</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <ImageIcon size={24} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{photographer.photos?.length || "0"}</p>
                            <p className="text-gray-400">Photos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Video size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{photographer.videos?.length || "0"}</p>
                            <p className="text-gray-400">Videos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <MapPin size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white capitalize">{photographer.city || "—"}</p>
                            <p className="text-gray-400">Location</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Photographer Details Card */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User size={24} />
                        Profile Information
                    </h3>

                    <div className="space-y-6">
                        <InfoCard
                            icon={<Star className="text-yellow-400" size={20} />}
                            label="Photographer Name"
                            value={photographer.name}
                        />
                        <InfoCard
                            icon={<MapPin className="text-red-400" size={20} />}
                            label="Location"
                            value={photographer.city ? photographer.city.charAt(0).toUpperCase() + photographer.city.slice(1) : "—"}
                        />
                        <InfoCard
                            icon={<Briefcase className="text-blue-400" size={20} />}
                            label="Total Services"
                            value={photographer.services?.length ? `${photographer.services.length} services` : "—"}
                        />
                    </div>

                    {/* Biography Section */}
                    {photographer.biography && (
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Edit3 size={18} />
                                About Me
                            </h4>
                            <p className="text-gray-300 leading-relaxed bg-gray-800/50 rounded-lg p-4">
                                {photographer.biography}
                            </p>
                        </div>
                    )}
                    Select an option


                    {/* Services Preview */}
                    {photographer.services && photographer.services.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Briefcase size={18} />
                                Services
                            </h4>
                            <div className="space-y-2">
                                {photographer.services.slice(0, 3).map((service, index) => (
                                    <div key={service._id || index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                                        <span className="text-white font-medium">{service.service}</span>
                                        <span className="text-yellow-400 font-semibold">{service.price}</span>
                                    </div>
                                ))}
                                {photographer.services.length > 3 && (
                                    <p className="text-gray-400 text-sm text-center">
                                        +{photographer.services.length - 3} more services
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Portfolio Gallery Card */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Camera size={24} />
                        Portfolio Preview
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium ml-2">
                            {photographer.photos?.length || 0} {photographer.photos?.length === 1 ? "photo" : "photos"}
                        </span>
                    </h3>

                    {photographer.photos && photographer.photos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {photographer.photos.map((photo, idx) => (
                                <div
                                    key={photo._id || idx}
                                    className="relative aspect-square rounded-xl overflow-hidden group border border-gray-600"
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.caption || `Portfolio photo ${idx + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-2">
                                        <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            Photo {idx + 1}
                                        </span>
                                    </div>
                                    {photo.caption && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-sm truncate">
                                                {photo.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
                            <Camera size={48} className="text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">No portfolio photos yet</p>
                            <p className="text-gray-500 text-sm">Add photos in the Photos section</p>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}