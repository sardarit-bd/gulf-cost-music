"use client";
import { Camera, Headphones, Music, Image } from "lucide-react";


import Link from "next/link";

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionText,
    onAction,
    actionLink
}) {
    const content = (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

            {actionLink ? (
                <Link
                    href={actionLink}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    {actionText}
                </Link>
            ) : onAction ? (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    {actionText}
                </button>
            ) : null}
        </div>
    );

    // If no action, just return the content
    return content;
}

// Media-specific empty state
export function MediaEmptyState({ type = "photos" }) {
    const config = {
        photos: {
            icon: Image,
            title: "No Photos Uploaded",
            description: "Upload photos of your studio space and equipment to attract clients",
            actionText: "Upload Photos"
        },
        audio: {
            icon: Music,
            title: "No Audio Sample",
            description: "Add an audio sample to showcase your production quality",
            actionText: "Upload Audio"
        }
    };

    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {type === "photos" ? (
                    <Camera className="w-8 h-8 text-gray-400" />
                ) : (
                    <Headphones className="w-8 h-8 text-gray-400" />
                )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {config[type].title}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {config[type].description}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                {config[type].actionText}
            </button>
        </div>
    );
}

