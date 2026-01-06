"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, FileText, Upload, Save, Loader2, Camera } from "lucide-react";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        bio: "",
        phone: "",
    });

    // Load profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = getCookie("token");
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                if (!data.success) throw new Error();

                setForm({
                    fullName: data.data.fullName || "",
                    email: data.data.user?.email || "",
                    bio: data.data.bio || "",
                    phone: data.data.phone || "",
                });

                setPreview(data.data.profilePhoto?.url || null);
            } catch {
                toast.error("Failed to load admin profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = getCookie("token");
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) =>
                formData.append(key, value)
            );

            // ✅ MUST MATCH multer field name
            if (photoFile) {
                formData.append("profilePhoto", photoFile);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();
            if (!data.success) throw new Error();

            toast.success("Profile updated successfully");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-500">Loading profile...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="px-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and profile information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Photo */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>

                            <div className="relative group">
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-50 to-gray-50">
                                    {preview ? (
                                        <Image
                                            src={preview}
                                            alt="Profile"
                                            width={192}
                                            height={192}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100">
                                            <User className="h-20 w-20 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Camera Icon Overlay */}
                                <label
                                    htmlFor="photo-upload"
                                    className="absolute bottom-4 right-1/2 translate-x-1/2 bg-[var(--primary)] text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-primary/80 transition-colors duration-200"
                                >
                                    <Camera className="h-5 w-5" />
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="mt-6 text-center">
                                <label
                                    htmlFor="photo-upload"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload New Photo
                                </label>
                                <p className="text-xs text-gray-500 mt-3">
                                    Recommended: Square image, at least 400x400px
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Mail className="h-4 w-4" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Phone className="h-4 w-4" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all duration-200"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <FileText className="h-4 w-4" />
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        rows={4}
                                        className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all duration-200 resize-none"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Brief description for your profile. URLs are hyperlinked.
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-primary/80  text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}