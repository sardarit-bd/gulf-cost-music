"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import HeroEditor from "./HeroEditor";
import HeroPreview from "./HeroPreview";
import { fetchHeroData } from "./heroUtils";
import CustomLoader from "@/components/shared/loader/Loader";

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHeroData = async () => {
            try {
                const data = await fetchHeroData();
                setHeroData({
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
                });
            } catch (error) {
                console.error("Error loading hero data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadHeroData();
    }, []);

    const handleChange = (field, value) => {
        setHeroData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setHeroData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const refreshData = async () => {
        const data = await fetchHeroData();
        setHeroData(prev => ({
            ...prev,
            ...data
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen py-20 bg-white">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <Toaster />
            <div className="px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hero Section Manager
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your website's hero section content, flash text, and video
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor Section */}
                    <HeroEditor
                        heroData={heroData}
                        onChange={handleChange}
                        onNestedChange={handleNestedChange}
                        onSave={refreshData}
                    />

                    {/* Preview Section */}
                    <HeroPreview heroData={heroData} />
                </div>
            </div>
        </div>
    );
}