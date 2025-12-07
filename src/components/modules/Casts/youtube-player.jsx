"use client";
import { useEffect, useRef, useState } from "react";

export default function YouTubePlayer({ videoId, autoPlay = false }) {
    const containerRef = useRef(null);
    const playerRef = useRef(null);

    const [playerId] = useState(
        () => `yt-player-${Math.random().toString(36).substr(2, 9)}`
    );

    // --- Load YouTube Iframe API safely ---
    const loadYouTubeAPI = () =>
        new Promise((resolve) => {
            if (window.YT && window.YT.Player) {
                resolve(window.YT);
            } else {
                const prevScript = document.getElementById("yt-api-script");
                if (!prevScript) {
                    const tag = document.createElement("script");
                    tag.id = "yt-api-script";
                    tag.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(tag);
                }

                // API callback fires once globally
                window.onYouTubeIframeAPIReady = () => {
                    resolve(window.YT);
                };
            }
        });

    // --- Create player only one time ---
    const createPlayer = (YT) => {
        playerRef.current = new YT.Player(playerId, {
            height: "550",
            width: "100%",
            videoId,
            playerVars: {
                autoplay: autoPlay ? 1 : 0,
                modestbranding: 1,
                rel: 0,
                controls: 1,
            },
            events: {
                onReady: (event) => {
                    if (autoPlay) event.target.playVideo();
                },
            },
        });
    };

    useEffect(() => {
        loadYouTubeAPI().then((YT) => {
            if (!playerRef.current) {
                createPlayer(YT);
            } else if (playerRef.current.loadVideoById) {
                // SAFE: Only after player is created
                playerRef.current.loadVideoById(videoId);
                if (autoPlay) playerRef.current.playVideo();
            }
        });
    }, [videoId]);

    return (
        <div className="relative h-[550px] w-full">
            <div
                ref={containerRef}
                id={playerId}
                className="w-full h-full rounded-xl overflow-hidden"
            />
        </div>
    );
}
