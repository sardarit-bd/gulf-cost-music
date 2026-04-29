"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import CustomLoader from "@/components/shared/loader/Loader";
import {
    Camera,
    CheckCircle,
    Eye,
    EyeOff,
    FileText,
    Key,
    Loader2,
    Lock,
    Mail,
    Phone,
    Save,
    Shield,
    Upload,
    User,
    XCircle
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        bio: "",
        phone: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordErrors, setPasswordErrors] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    const passwordStrength = getPasswordStrength(passwordForm.newPassword);
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-blue-500",
        "bg-green-500",
    ];

    useEffect(() => {
        if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
            setPasswordErrors(prev => ({ ...prev, newPassword: "Password must be at least 6 characters" }));
        } else if (passwordForm.newPassword && passwordForm.newPassword.length > 0) {
            setPasswordErrors(prev => ({ ...prev, newPassword: "" }));
        }

        if (passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
            setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
    }, [passwordForm.newPassword, passwordForm.confirmPassword]);

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

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Photo size should be less than 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file");
                return;
            }
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

            const isUploadingPhoto = !!photoFile;

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

            // Show success message based on whether photo was uploaded
            if (isUploadingPhoto) {
                toast.success("Profile photo uploaded successfully!");
                setPhotoFile(null); // Clear the photo file after successful upload
            } else {
                toast.success("Profile updated successfully! ✨");
            }

        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        setChangingPassword(true);

        try {
            const token = getCookie("token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile/change-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword,
                        confirmPassword: passwordForm.confirmPassword,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to change password");
            }

            toast.success("Password changed successfully! 🔒");

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowChangePassword(false);
        } catch (error) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen py-20">
                    <div className="text-center">
                        <CustomLoader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <Toaster />
                {/* Header */}
                <div className="mb-8">
                    <div className="border border-gray-300 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-600">Admin Profile</h1>
                                <p className="text-gray-500 mt-2">Manage your account settings and profile information</p>
                            </div>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-gray-600 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border border-gray-200 cursor-pointer"
                            >
                                <Key className="h-4 w-4" />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Photo Card */}
                    <div className="lg:col-span-1">
                        <div className="border border-gray-300 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                            <h2 className="text-lg font-semibold text-gray-600 mb-6 flex items-center gap-2">
                                <Camera className="h-5 w-5 text-primary" />
                                Profile Picture
                            </h2>

                            <div className="relative group">
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg bg-muted">
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
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <User className="h-20 w-20 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <label
                                    htmlFor="photo-upload"
                                    className="absolute bottom-4 right-1/2 translate-x-1/2 bg-primary text-primary-foreground p-3 rounded-full cursor-pointer shadow-lg hover:bg-primary/80 transition-all duration-200 transform hover:scale-105"
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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-xl cursor-pointer transition-all duration-200 shadow-md"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload New Photo
                                </label>

                                <p className="text-xs text-gray-400 mt-3">
                                    Recommended: Square image, max 5MB
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-300">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span>Account secured</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                            <h2 className="text-lg font-semibold text-gray-600 mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Profile Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <User className="h-4 w-4 text-primary" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <Mail className="h-4 w-4 text-primary" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <FileText className="h-4 w-4 text-primary" />
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        rows={4}
                                        className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Brief description for your profile. URLs are hyperlinked.
                                    </p>
                                </div>

                                <div className="border-t border-gray-300 pt-6">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 cursor-pointer"
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

            {/* Password Change Modal */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-fade-in-up">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/20">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-600">Change Password</h2>
                                </div>
                                <button
                                    onClick={() => setShowChangePassword(false)}
                                    className="text-muted-foreground hover:text-red-300 transition-colors cursor-pointer"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-primary" />
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-green-400 cursor-pointer"
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-5 w-5 " /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Key className="h-4 w-4 text-primary" />
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password (min 6 characters)"
                                            className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-green-400 cursor-pointer "
                                        >
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {passwordForm.newPassword && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 h-1.5 mb-2">
                                                {[...Array(4)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 rounded-full transition-all duration-300 ${i < passwordStrength
                                                            ? strengthColors[passwordStrength - 1]
                                                            : "bg-border"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Strength: <span className="font-medium">{strengthLabels[passwordStrength]}</span>
                                                {passwordStrength === 4 && (
                                                    <CheckCircle className="h-3 w-3 text-green-500 inline ml-1" />
                                                )}
                                            </p>
                                            {passwordErrors.newPassword && (
                                                <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-green-400 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {passwordErrors.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowChangePassword(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-muted transition-all duration-200 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={changingPassword || !!passwordErrors.newPassword || !!passwordErrors.confirmPassword}
                                        className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 cursor-pointer"
                                    >
                                        {changingPassword ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                                Changing...
                                            </>
                                        ) : (
                                            "Change Password"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>
        </AdminLayout>
    );
}