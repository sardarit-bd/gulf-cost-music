"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import { Eye, ImageIcon, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminFooterPage() {
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Fetch Footer Data
    const fetchFooter = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/footer`);
            const data = await res.json();
            if (data.success) {
                setFooter(data.data);

                setPreviewLogo(data.data.logoUrl);
                console.log(data.data.logoUrl)
            }
        } catch (err) {
            toast.error("Failed to load footer data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFooter();
    }, []);

    // Handle logo change with preview
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }

            // Set the file for later upload
            setLogoFile(file);

            // Create preview immediately from the selected file
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewLogo(e.target.result);
            };
            reader.readAsDataURL(file);

            toast.success("Logo selected! Click Save to upload.");
        }
    };

    // Update field
    const handleChange = (section, field, value) => {
        setFooter(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Update array sections
    const updateArrayItem = (section, index, value) => {
        const updatedArr = [...footer[section]];
        updatedArr[index] = value;

        setFooter(prev => ({
            ...prev,
            [section]: updatedArr
        }));
    };

    const addArrayItem = (section) => {
        setFooter(prev => ({
            ...prev,
            [section]: [...prev[section], "New Item"]
        }));
    };

    const removeArrayItem = (section, index) => {
        if (footer[section].length <= 1) {
            toast.error(`At least one item is required in ${section}`);
            return;
        }

        const updatedArr = footer[section].filter((_, i) => i !== index);
        setFooter(prev => ({
            ...prev,
            [section]: updatedArr
        }));
    };

    // Save Footer
    const handleSave = async () => {
        try {
            setSaving(true);

            const formData = new FormData();
            formData.append("getInTouch", JSON.stringify(footer.getInTouch));
            formData.append("usefulLinks", JSON.stringify(footer.usefulLinks));
            formData.append("phone", footer.contact.phone);
            formData.append("email", footer.contact.email);
            formData.append("instagram", footer.socialLinks.instagram);
            formData.append("youtube", footer.socialLinks.youtube);

            // Use the separate logoFile state
            if (logoFile) {
                formData.append("logo", logoFile);
                toast.loading("Uploading logo...", { id: "logo-upload" });
            }

            const res = await fetch(`${API_BASE}/api/footer/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                toast.dismiss("logo-upload");
                toast.success("Footer updated successfully!");
                setLogoFile(null);
                fetchFooter();
            } else {
                toast.dismiss("logo-upload");
                toast.error(data.message || "Failed to save footer.");
            }
        } catch (err) {
            toast.dismiss("logo-upload");
            toast.error("Error updating footer");
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    // Reset logo to original
    const resetLogo = () => {
        if (footer?.logoUrl) {
            setPreviewLogo(footer.logoUrl);
        }
        setLogoFile(null);
        toast.success("Logo reset to original");
    };

    if (loading || !footer) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading footer data...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Toaster />

            <div className="p-6 max-w-9xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
                        <p className="text-gray-600 mt-2">Manage your website footer content and links</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Logo and Contact */}
                    <div className="space-y-8">
                        {/* LOGO SECTION */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ImageIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Logo Settings</h2>
                                </div>
                                {logoFile && (
                                    <button
                                        onClick={resetLogo}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <img
                                            src={previewLogo || "/images/logo.png"}
                                            alt="Footer Logo"
                                            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-2xl object-contain bg-gray-50 group-hover:border-blue-300 transition-colors"
                                            onError={(e) => {
                                                // If image fails to load, show placeholder
                                                e.target.src = "/images/placeholder-logo.png";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        {logoFile && (
                                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                New
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <label className="cursor-pointer block">
                                            <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-3 transition-all duration-200 shadow-md text-center justify-center">
                                                <Upload className="w-4 h-4" />
                                                {logoFile ? "Change Logo" : "Upload New Logo"}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoChange}
                                            />
                                        </label>

                                        {logoFile && (
                                            <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                                <strong>New logo selected:</strong> {logoFile.name}
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-500">
                                            Recommended: 200x200px PNG or JPG, max 2MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CONTACT SECTION */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={footer.contact.phone}
                                        onChange={(e) => handleChange("contact", "phone", e.target.value)}
                                        className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={footer.contact.email}
                                        onChange={(e) => handleChange("contact", "email", e.target.value)}
                                        className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-pink-100 rounded-lg">
                                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        value={footer.socialLinks.instagram}
                                        onChange={(e) => handleChange("socialLinks", "instagram", e.target.value)}
                                        className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                                        placeholder="https://instagram.com/username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        YouTube URL
                                    </label>
                                    <input
                                        type="url"
                                        value={footer.socialLinks.youtube}
                                        onChange={(e) => handleChange("socialLinks", "youtube", e.target.value)}
                                        className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        placeholder="https://youtube.com/channel"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Links */}
                    <div className="space-y-8">
                        {/* ARRAY SECTIONS */}
                        {["getInTouch", "usefulLinks"].map((section) => (
                            <div key={section} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 capitalize">
                                        {section.replace(/([A-Z])/g, " $1")}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {footer[section].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 group">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayItem(section, index, e.target.value)}
                                                    className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-gray-400"
                                                    placeholder={`Enter ${section.replace(/([A-Z])/g, " $1")} item`}
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeArrayItem(section, index)}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => addArrayItem(section)}
                                    className="flex items-center gap-2 px-4 py-3 mt-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all w-full justify-center border-2 border-dashed border-green-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New Item
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}