"use client";

import CustomLoader from "@/components/shared/loader/Loader";
import { Edit2, Eye, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import HeroEditor from "./HeroEditor";
import HeroPreview from "./HeroPreview";
import { fetchHeroData, saveHeroData } from "./heroUtils";

export default function HeroManagerDashboard() {
    const [heroData, setHeroData] = useState({
        title: "",
        subtitlePrefix: "",
        flashWords: ["Artists", "Venues", "Photographers", "Studios", "Journalists"],
        buttonText: "",
        videoUrl: "",
        videoPublicId: "",
        bottomText: {
            artistName: "",
            songName: "",
            separator: "-",
            isVisible: true
        },
        animationSettings: {
            interval: 1500,
            textColor: "#FBBF24",
            isEnabled: true
        }
    });
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const loadHeroData = async () => {
            try {
                const data = await fetchHeroData();
                const newData = {
                    title: data.title || "",
                    subtitlePrefix: data.subtitlePrefix || "Experience the best with stunning",
                    flashWords: data.flashWords || ["Artists", "Venues", "Photographers", "Studios", "Journalists"],
                    buttonText: data.buttonText || "Get Started",
                    videoUrl: data.videoUrl || "",
                    videoPublicId: data.videoPublicId || "",
                    bottomText: {
                        artistName: data.bottomText?.artistName || "Anna E. Westcoat",
                        songName: data.bottomText?.songName || "Gulf County",
                        separator: data.bottomText?.separator || "-",
                        isVisible: data.bottomText?.isVisible !== undefined ? data.bottomText.isVisible : true
                    },
                    animationSettings: {
                        interval: data.animationSettings?.interval || 1500,
                        textColor: data.animationSettings?.textColor || "#FBBF24",
                        isEnabled: data.animationSettings?.isEnabled !== undefined ? data.animationSettings.isEnabled : true
                    }
                };
                setHeroData(newData);
                setOriginalData(JSON.parse(JSON.stringify(newData)));
            } catch (error) {
                console.error("Error loading hero data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadHeroData();
    }, []);

    const handleChange = (field, value) => {
        if (!isEditMode) return;
        setHeroData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        if (!isEditMode) return;
        setHeroData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleCancel = () => {
        if (originalData) {
            setHeroData(JSON.parse(JSON.stringify(originalData)));
        }
        setIsEditMode(false);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveHeroData(heroData);
            setOriginalData(JSON.parse(JSON.stringify(heroData)));
            setIsEditMode(false);
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setSaving(false);
        }
    };

    const refreshData = async () => {
        const data = await fetchHeroData();
        const newData = {
            title: data.title || "",
            subtitlePrefix: data.subtitlePrefix || "Experience the best with stunning",
            flashWords: data.flashWords || ["Artists", "Venues", "Photographers", "Studios", "Journalists"],
            buttonText: data.buttonText || "Get Started",
            videoUrl: data.videoUrl || "",
            videoPublicId: data.videoPublicId || "",
            bottomText: {
                artistName: data.bottomText?.artistName || "Anna E. Westcoat",
                songName: data.bottomText?.songName || "Gulf County",
                separator: data.bottomText?.separator || "-",
                isVisible: data.bottomText?.isVisible !== undefined ? data.bottomText.isVisible : true
            },
            animationSettings: {
                interval: data.animationSettings?.interval || 1500,
                textColor: data.animationSettings?.textColor || "#FBBF24",
                isEnabled: data.animationSettings?.isEnabled !== undefined ? data.animationSettings.isEnabled : true
            }
        };
        setHeroData(newData);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen py-20 bg-gray-50">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <Toaster />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header with Actions */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Hero Section Manager
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                Manage your website's hero section content, flash text, and video
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => window.open("/", "_blank")}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>

                            {!isEditMode ? (
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Section
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {saving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor Section */}
                    <HeroEditor
                        heroData={heroData}
                        onChange={handleChange}
                        onNestedChange={handleNestedChange}
                        isEditMode={isEditMode}
                        refreshData={refreshData}
                    />

                    {/* Preview Section */}
                    <HeroPreview heroData={heroData} />
                </div>
            </div>

            {/* Mobile Save Button - Only in edit mode */}
            {isEditMode && (
                <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                        >
                            <X className="w-5 h-5" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}