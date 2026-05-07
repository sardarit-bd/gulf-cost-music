"use client";
import { useEffect, useRef, useState } from "react";

const ClampText = ({
    text,
    lines = 1,
    className = "",
    showTooltip = true,
    tooltipPosition = "top",
    maxLength
}) => {
    const [isClamped, setIsClamped] = useState(false);
    const [showTooltipState, setShowTooltipState] = useState(false);
    const textRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            const element = textRef.current;
            // Check if text is clamped (scroll height > client height)
            const clamped = element.scrollHeight > element.clientHeight;
            setIsClamped(clamped);
        }
    }, [text, lines]);

    // Handle maxLength truncation
    let displayText = text || "";
    if (maxLength && displayText.length > maxLength) {
        displayText = displayText.substring(0, maxLength) + "...";
    }

    const handleMouseEnter = () => {
        if (showTooltip && isClamped) {
            // Clear any existing timeout
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setShowTooltipState(true);
        }
    };

    const handleMouseLeave = () => {
        if (showTooltip) {
            // Delay hiding to allow moving to tooltip
            timeoutRef.current = setTimeout(() => {
                setShowTooltipState(false);
            }, 100);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const tooltipPositionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    const clampedText = (
        <div
            ref={textRef}
            className={`${className}`}
            style={{
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
            }}
        >
            {displayText}
        </div>
    );

    if (!text) {
        return <span className={className}>—</span>;
    }

    if (showTooltip && isClamped) {
        return (
            <div
                className="relative inline-block w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {clampedText}
                {showTooltipState && (
                    <div className={`absolute z-50 ${tooltipPositionClasses[tooltipPosition]}`}>
                        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl max-w-xs break-words whitespace-normal">
                            {displayText}
                            <div
                                className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${tooltipPosition === "top"
                                        ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                                        : tooltipPosition === "bottom"
                                            ? "bottom-full left-1/2 -translate-x-1/2 -mb-1"
                                            : tooltipPosition === "left"
                                                ? "left-full top-1/2 -translate-y-1/2 -ml-1"
                                                : "right-full top-1/2 -translate-y-1/2 -mr-1"
                                    }`}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return clampedText;
};

export default ClampText;