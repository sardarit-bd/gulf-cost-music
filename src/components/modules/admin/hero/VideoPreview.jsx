"use client";

export default function VideoPreview({ videoUrl }) {
    if (!videoUrl) return null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // Check if it's a full URL or public_id
    const isFullUrl = videoUrl.includes('http');

    const posterUrl = isFullUrl
        ? videoUrl
        : `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${videoUrl}.jpg`;

    const videoSrc = isFullUrl
        ? videoUrl
        : `https://res.cloudinary.com/${cloudName}/video/upload/q_auto/${videoUrl}.mp4`;

    return (
        <div className="relative w-full h-64 md:h-72 lg:h-80 bg-gray-900 rounded-md overflow-hidden mb-3">
            <video
                controls
                muted
                autoPlay={false}
                className="w-full h-full object-cover"
                poster={posterUrl}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}