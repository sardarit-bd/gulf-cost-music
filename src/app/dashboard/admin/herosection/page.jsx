'use client';

import AdminLayout from '@/components/modules/dashboard/AdminLayout';
import { Loader2, Play, Save, Trash2, Upload } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

// Video Preview Component
const VideoPreview = ({ videoUrl }) => {
    if (!videoUrl) return null;

    return (
        <div className="relative w-full h-64 md:h-72 lg:h-80 bg-gray-900 rounded-md overflow-hidden">
            <video
                controls
                muted
                autoPlay={false}
                className="w-full h-full object-cover"
                poster={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${videoUrl}.jpg`}
            >
                <source
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto/${videoUrl}.mp4`}
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default function HeroManager() {
    const [heroData, setHeroData] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        videoUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchHeroData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/hero-video`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                setHeroData(result.data);
            } else {
                toast.error(result.message || 'Failed to load data');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load hero section.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroData();
    }, []);

    const handleChange = (field, value) => {
        setHeroData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE}/api/hero-video/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(heroData)
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Hero section saved successfully!');
                fetchHeroData();
            } else {
                toast.error(result.message || 'Failed to save');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Error saving hero section');
        } finally {
            setSaving(false);
        }
    };

    const removeVideo = () => {
        setHeroData(prev => ({ ...prev, videoUrl: '' }));
        toast.success('Video removed');
    };

    const handleUploadSuccess = (result) => {
        setUploading(false);
        if (result.event === "success") {
            const publicId = result.info.public_id;
            setHeroData(prev => ({ ...prev, videoUrl: publicId }));
            toast.success("Video uploaded successfully!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading hero section...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 py-6">
                <Toaster />
                <div className="px-4">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Hero Section Manager</h1>
                        <p className="text-gray-600 mt-1">Manage your website's hero section content and video</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Editor Section */}
                        <div className="space-y-4">
                            {/* Text Content Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Text Content</h2>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
                                        <input
                                            type="text"
                                            value={heroData.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your main title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <textarea
                                            value={heroData.subtitle}
                                            onChange={(e) => handleChange('subtitle', e.target.value)}
                                            rows={2}
                                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your subtitle"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                        <input
                                            type="text"
                                            value={heroData.buttonText}
                                            onChange={(e) => handleChange('buttonText', e.target.value)}
                                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter button text"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Video Upload Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900">Hero Video</h2>
                                    {heroData.videoUrl && (
                                        <button
                                            onClick={removeVideo}
                                            className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-medium"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {/* Video Preview with Fallback */}
                                <VideoPreview videoUrl={heroData.videoUrl} />

                                {!heroData.videoUrl && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm mb-1">No video uploaded</p>
                                        <p className="text-xs text-gray-400">Upload a background video for your hero section</p>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <CldUploadWidget
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                    options={{
                                        sources: ['local'],
                                        multiple: false,
                                        resourceType: 'video',
                                        maxFileSize: 104857600,
                                        clientAllowedFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
                                    }}
                                    onUpload={() => setUploading(true)}
                                    onSuccess={handleUploadSuccess}
                                    onError={(error) => {
                                        setUploading(false);
                                        toast.error('Upload failed: ' + error.message);
                                    }}
                                >
                                    {({ open }) => (
                                        <button
                                            onClick={() => open()}
                                            disabled={uploading}
                                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4" />
                                            )}
                                            {uploading ? 'Uploading...' : 'Upload Video'}
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-[var(--primary)] hover:bg-primary/80 transition text-black py-3 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        {/* Preview Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Live Preview</h2>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-md p-6 border-2 border-dashed border-gray-200">
                                <div className="text-center space-y-4">
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                        {heroData.title || 'Your Hero Title'}
                                    </h1>
                                    <p className="text-base text-gray-600 leading-relaxed">
                                        {heroData.subtitle || 'Your compelling subtitle will appear here'}
                                    </p>
                                    <button className="bg-[var(--primary)] text-black px-6 py-2 rounded-md font-medium transition-all inline-flex items-center gap-1 text-sm">
                                        {heroData.buttonText || 'Get Started'}
                                    </button>
                                    {heroData.videoUrl && (
                                        <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                                            <p className="text-green-700 text-xs flex items-center justify-center gap-1">
                                                <Play className="w-3 h-3" />
                                                Background video is active
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}