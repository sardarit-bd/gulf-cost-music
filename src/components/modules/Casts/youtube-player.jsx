"use client";
import { useEffect, useRef, useState } from "react";

export default function YouTubePlayer({ videoId, autoPlay = false }) {
  const playerRef = useRef(null);
  const [playerId] = useState(
    () => `yt-player-${Math.random().toString(36).substr(2, 9)}`,
  );

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
        window.onYouTubeIframeAPIReady = () => {
          resolve(window.YT);
        };
      }
    });

  useEffect(() => {
    let player;

    loadYouTubeAPI().then((YT) => {
      player = new YT.Player(playerId, {
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
            if (autoPlay) {
              event.target.playVideo();
            }
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, autoPlay]);

  return (
    <div className="relative h-[550px] w-full">
      <div id={playerId} className="w-full h-full rounded-xl overflow-hidden" />
    </div>
  );
}
