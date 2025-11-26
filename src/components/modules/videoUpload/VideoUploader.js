"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export default function VideoUploader({ onUploaded }) {
    const [videoUrl, setVideoUrl] = useState("");

    return (
        <div>
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    sources: ["local", "camera", "url"],
                    resource_type: "video",
                    max_file_size: 200000000, // 200MB
                }}
                onUpload={(result) => {
                    const secureUrl = result.info.secure_url;
                    setVideoUrl(secureUrl);
                    onUploaded(secureUrl);
                }}
            >
                {({ open }) => (
                    <button
                        type="button"
                        onClick={() => open()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                        Upload Video
                    </button>
                )}
            </CldUploadWidget>

            {videoUrl && (
                <video src={videoUrl} controls className="w-full mt-4 rounded-lg"></video>
            )}
        </div>
    );
}
