import React from "react";

interface MudraIconProps {
    name: string;
    className?: string;
    isActive?: boolean;
    iconSrc?: string; // [NEW] Optional image source
}

export default function MudraIcon({ name, className = "", isActive = false, iconSrc }: MudraIconProps) {

    // [NEW] If iconSrc is provided, render the image
    if (iconSrc) {
        return (
            <div className={`relative ${className} flex items-center justify-center`}>
                <img
                    src={iconSrc}
                    alt={name}
                    className={`
                        w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-500
                        ${isActive ? "scale-110 drop-shadow-[0_0_15px_cyan] animate-pulse" : "opacity-80 grayscale-[0.3]"}
                    `}
                />
            </div>
        );
    }

    // ... Existing SVG Logic Fallback ...
    // Scale factor for SVG coordinates
    const s = 20;
    const cx = 50;
    const cy = 50;

    const pts: Record<string, [number, number]> = {
        wrist: [0, 1.5],
        thumb_base: [-0.6, 0.8],
        thumb_tip: [-1.2, -0.2],
        index_base: [-0.3, -0.5],
        index_tip: [-0.4, -1.8],
        mid_base: [0, -0.6],
        mid_tip: [0, -2.0],
        ring_base: [0.3, -0.5],
        ring_tip: [0.4, -1.8],
        pinky_base: [0.5, -0.3],
        pinky_tip: [0.7, -1.4],
    };

    // Modify based on Mudra
    if (name === "Gyan") {
        pts.index_tip = [-0.8, -0.5];
        pts.thumb_tip = [-0.8, -0.5];
    } else if (name === "Prana") {
        pts.ring_tip = [-0.5, 0.2];
        pts.pinky_tip = [-0.5, 0.2];
        pts.thumb_tip = [-0.5, 0.2];
    } else if (name === "Apana") {
        pts.mid_tip = [-0.5, 0.2];
        pts.ring_tip = [-0.5, 0.2];
        pts.thumb_tip = [-0.5, 0.2];
    } else if (name === "Surya") {
        pts.ring_tip = pts.thumb_base;
        pts.thumb_tip = pts.thumb_base;
    } else if (name === "Varun") {
        pts.pinky_tip = [-0.6, 0];
        pts.thumb_tip = [-0.6, 0];
    } else if (name === "Anjali") {
        pts.thumb_tip = [-0.2, -0.5];
        pts.index_tip = [0, -1.8];
        pts.mid_tip = [0.1, -1.9];
        pts.ring_tip = [0.2, -1.8];
        pts.pinky_tip = [0.3, -1.6];
    }

    const getPt = (pName: string): string => {
        const [dx, dy] = pts[pName];
        const x = cx + dx * s;
        const y = cy + dy * s;
        return `${x},${y}`;
    };

    // Bioluminescent Palette
    const colors = {
        thumb: "#ff2d55", // Neon Pink/Red
        index: "#34c759", // Neon Green
        mid: "#ffcc00",   // Neon Yellow
        ring: "#ff9500",  // Neon Orange
        pinky: "#007aff", // Bright Blue
        wrist: "#ffffff",
    };

    const filterId = `glow-${name.toLowerCase()}`;

    return (
        <svg
            viewBox="0 0 100 100"
            className={`w-12 h-12 transition-all duration-500 ${className} ${isActive ? "animate-pulse" : ""}`}
            style={{ overflow: "visible" }}
        >
            <defs>
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <g filter={isActive ? `url(#${filterId})` : "none"}>
                {/* Wrist Lines */}
                <line
                    x1={getPt("wrist").split(",")[0]}
                    y1={getPt("wrist").split(",")[1]}
                    x2={getPt("thumb_base").split(",")[0]}
                    y2={getPt("thumb_base").split(",")[1]}
                    stroke={colors.wrist}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity={isActive ? 0.9 : 0.4}
                />
                <line
                    x1={getPt("wrist").split(",")[0]}
                    y1={getPt("wrist").split(",")[1]}
                    x2={getPt("index_base").split(",")[0]}
                    y2={getPt("index_base").split(",")[1]}
                    stroke={colors.wrist}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity={isActive ? 0.9 : 0.4}
                />
                <line
                    x1={getPt("wrist").split(",")[0]}
                    y1={getPt("wrist").split(",")[1]}
                    x2={getPt("mid_base").split(",")[0]}
                    y2={getPt("mid_base").split(",")[1]}
                    stroke={colors.wrist}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity={isActive ? 0.9 : 0.4}
                />
                <line
                    x1={getPt("wrist").split(",")[0]}
                    y1={getPt("wrist").split(",")[1]}
                    x2={getPt("ring_base").split(",")[0]}
                    y2={getPt("ring_base").split(",")[1]}
                    stroke={colors.wrist}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity={isActive ? 0.9 : 0.4}
                />
                <line
                    x1={getPt("wrist").split(",")[0]}
                    y1={getPt("wrist").split(",")[1]}
                    x2={getPt("pinky_base").split(",")[0]}
                    y2={getPt("pinky_base").split(",")[1]}
                    stroke={colors.wrist}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity={isActive ? 0.9 : 0.4}
                />

                {/* Finger Skeletal structure */}
                <line
                    x1={getPt("thumb_base").split(",")[0]}
                    y1={getPt("thumb_base").split(",")[1]}
                    x2={getPt("thumb_tip").split(",")[0]}
                    y2={getPt("thumb_tip").split(",")[1]}
                    stroke={colors.thumb}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx={getPt("thumb_tip").split(",")[0]} cy={getPt("thumb_tip").split(",")[1]} r="3" fill={colors.thumb} />

                <line
                    x1={getPt("index_base").split(",")[0]}
                    y1={getPt("index_base").split(",")[1]}
                    x2={getPt("index_tip").split(",")[0]}
                    y2={getPt("index_tip").split(",")[1]}
                    stroke={colors.index}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx={getPt("index_tip").split(",")[0]} cy={getPt("index_tip").split(",")[1]} r="3" fill={colors.index} />

                <line
                    x1={getPt("mid_base").split(",")[0]}
                    y1={getPt("mid_base").split(",")[1]}
                    x2={getPt("mid_tip").split(",")[0]}
                    y2={getPt("mid_tip").split(",")[1]}
                    stroke={colors.mid}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx={getPt("mid_tip").split(",")[0]} cy={getPt("mid_tip").split(",")[1]} r="3" fill={colors.mid} />

                <line
                    x1={getPt("ring_base").split(",")[0]}
                    y1={getPt("ring_base").split(",")[1]}
                    x2={getPt("ring_tip").split(",")[0]}
                    y2={getPt("ring_tip").split(",")[1]}
                    stroke={colors.ring}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx={getPt("ring_tip").split(",")[0]} cy={getPt("ring_tip").split(",")[1]} r="3" fill={colors.ring} />

                <line
                    x1={getPt("pinky_base").split(",")[0]}
                    y1={getPt("pinky_base").split(",")[1]}
                    x2={getPt("pinky_tip").split(",")[0]}
                    y2={getPt("pinky_tip").split(",")[1]}
                    stroke={colors.pinky}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx={getPt("pinky_tip").split(",")[0]} cy={getPt("pinky_tip").split(",")[1]} r="3" fill={colors.pinky} />
            </g>
        </svg>
    );
}
