"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import HeroEditor from "./HeroEditor";
import HeroPreview from "./HeroPreview";
import { fetchHeroData } from "./heroUtils";

export default function HeroManagerDashboard() {
    const [heroData, setHeroData] = useState({
        title: "",
        subtitle: "",
        buttonText: "",
        videoUrl: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHeroData = async () => {
            try {
                const data = await fetchHeroData();
                setHeroData(data);
            } finally {
                setLoading(false);
            }
        };
        loadHeroData();
    }, []);

    const handleChange = (field, value) => {
        setHeroData(prev => ({ ...prev, [field]: value }));
    };

    const refreshData = async () => {
        const data = await fetchHeroData();
        setHeroData(data);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading hero section...</p>
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
                        Manage your website's hero section content and video
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor Section */}
                    <HeroEditor
                        heroData={heroData}
                        onChange={handleChange}
                        onSave={refreshData}
                    />

                    {/* Preview Section */}
                    <HeroPreview heroData={heroData} />
                </div>
            </div>
        </div>
    );
}