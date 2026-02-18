import {
    Calendar,
    Camera,
    CheckCircle,
    DollarSign,
    Mail,
    MapPin,
    Star,
    Video,
    X
} from "lucide-react";

export default function ViewProfileModal({ photographer, isOpen, onClose }) {
    if (!isOpen || !photographer) return null;

    const getPlanColor = (plan) => {
        return plan === "pro" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
    };

    const getStatusColor = (status) => {
        return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                            {photographer.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{photographer.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                    <MapPin size={14} />
                                    {photographer.city || 'Location not specified'}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(photographer.user?.subscriptionPlan)}`}>
                                    {photographer.user?.subscriptionPlan?.toUpperCase() || 'FREE'} PLAN
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Status Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle size={16} className={photographer.isActive ? "text-green-500" : "text-gray-400"} />
                                        <span className="text-sm font-medium text-gray-600">Status</span>
                                    </div>
                                    <span className={`font-semibold ${getStatusColor(photographer.isActive)} px-2 py-1 rounded-full text-xs`}>
                                        {photographer.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star size={16} className={photographer.isVerified ? "text-green-500" : "text-gray-400"} />
                                        <span className="text-sm font-medium text-gray-600">Verification</span>
                                    </div>
                                    <span className={`font-semibold ${photographer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-2 py-1 rounded-full text-xs`}>
                                        {photographer.isVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Camera size={16} className="text-blue-500" />
                                        <span className="text-sm font-medium text-gray-600">Photos</span>
                                    </div>
                                    <p className="text-gray-500 text-xl font-bold">{photographer.photos?.length || 0}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Video size={16} className="text-purple-500" />
                                        <span className="text-sm font-medium text-gray-600">Videos</span>
                                    </div>
                                    <p className="text-gray-500 text-xl font-bold">{photographer.videos?.length || 0}</p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white border border-gray-300 rounded-xl p-5">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                    <Mail size={18} />
                                    Contact Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                                        <p className="font-medium text-gray-900 break-all">{photographer.user?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Account Type</label>
                                        <p className="font-medium text-gray-900">{photographer.user?.userType || 'Photographer'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Joined Date</label>
                                        <p className="font-medium text-gray-900 flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(photographer.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Last Updated</label>
                                        <p className="font-medium text-gray-900">
                                            {new Date(photographer.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Biography */}
                            {photographer.biography && (
                                <div className="bg-white border rounded-xl p-5">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Biography</h3>
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {photographer.biography}
                                    </p>
                                </div>
                            )}

                            {/* Services */}
                            {photographer.services?.length > 0 && (
                                <div className="bg-white border rounded-xl p-5">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                        <DollarSign size={18} />
                                        Services ({photographer.services.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {photographer.services.map((service, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                                <div>
                                                    <p className="font-medium text-gray-900">{service.service}</p>
                                                    <p className="text-sm text-gray-500">{service.description || 'No description'}</p>
                                                </div>
                                                <span className="text-lg font-bold text-green-600">${service.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Media & Actions */}
                        <div className="space-y-6">
                            {/* Media Preview */}
                            <div className="bg-white border border-gray-300 rounded-xl p-5">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4">Media</h3>

                                {/* Photos Preview */}
                                {photographer.photos?.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Photos</span>
                                            <span className="text-xs text-gray-500">{photographer.photos.length} items</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {photographer.photos.slice(0, 4).map((photo, index) => (
                                                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                                    <img
                                                        src={photo.url}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Videos Preview */}
                                {photographer.videos?.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Videos</span>
                                            <span className="text-xs text-gray-500">{photographer.videos.length} items</span>
                                        </div>
                                        <div className="space-y-2">
                                            {photographer.videos.slice(0, 2).map((video, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="font-medium text-sm text-gray-900 truncate">{video.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{video.url}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!photographer.photos?.length && !photographer.videos?.length && (
                                    <p className="text-gray-500 text-center py-4">No media uploaded yet</p>
                                )}
                            </div>
                            {/* Account Details */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Account Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">User ID:</span>
                                        <code className="text-gray-900 font-mono text-xs">{photographer.user?._id?.slice(-8)}</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Profile ID:</span>
                                        <code className="text-gray-900 font-mono text-xs">{photographer._id?.slice(-8)}</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subscription:</span>
                                        <span className={`font-medium ${photographer.user?.subscriptionPlan === 'pro' ? 'text-yellow-600' : 'text-gray-600'}`}>
                                            {photographer.user?.subscriptionPlan || 'free'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Last updated: {new Date(photographer.updatedAt).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => window.open(`/admin/photographers/edit/${photographer._id}`, '_blank')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}