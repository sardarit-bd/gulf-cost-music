"use client";
import { useEffect, useRef, useState } from "react";

export default function YouTubePlayer({ videoId, autoPlay = false }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [playerId] = useState(
    () => `yt-player-${Math.random().toString(36).substr(2, 9)}`,
  );
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Clean up function
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying player:", error);
        }
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!videoId) return;

    let player;
    let checkInterval;

    // Load YouTube API if not already loaded
    const loadYouTubeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
          return;
        }

        // Create script if it doesn't exist
        if (!document.getElementById("yt-api-script")) {
          const tag = document.createElement("script");
          tag.id = "yt-api-script";
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(tag);
        }

        // Check for API readiness
        checkInterval = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkInterval);
            resolve(window.YT);
          }
        }, 100);
      });
    };

    // Initialize player
    const initPlayer = async () => {
      try {
        await loadYouTubeAPI();

        // Small delay to ensure container is ready
        setTimeout(() => {
          if (!containerRef.current) return;

          // Destroy existing player if any
          if (playerRef.current) {
            try {
              playerRef.current.destroy();
            } catch (error) {
              console.error("Error destroying existing player:", error);
            }
            playerRef.current = null;
          }

          // Create new player
          playerRef.current = new window.YT.Player(playerId, {
            height: "550",
            width: "100%",
            videoId: videoId,
            playerVars: {
              autoplay: autoPlay ? 1 : 0,
              modestbranding: 1,
              rel: 0,
              controls: 1,
              showinfo: 0,
              fs: 1,
              iv_load_policy: 3,
              enablejsapi: 1,
            },
            events: {
              onReady: (event) => {
                console.log("YouTube Player Ready");
                setIsReady(true);
                setLoadError(false);
                if (autoPlay) {
                  event.target.playVideo();
                }
              },
              onError: (event) => {
                console.error("YouTube Player Error:", event.data);
                setLoadError(true);
              },
            },
          });
        }, 500); // Increased delay to 500ms
      } catch (error) {
        console.error("Error loading YouTube API:", error);
        setLoadError(true);
      }
    };

    initPlayer();

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error("Error destroying player:", error);
        }
        playerRef.current = null;
      }
    };
  }, [videoId, autoPlay, playerId]);

  if (loadError) {
    return (
      <div className="relative h-[550px] w-full bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-400 font-semibold mb-2">Failed to load video</p>
          <p className="text-sm text-gray-400 mb-4">Video ID: {videoId}</p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[550px] w-full bg-black rounded-xl overflow-hidden">
      <div id={playerId} className="w-full h-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading video...</p>
          </div>
        </div>
      )}
    </div>
  );
}