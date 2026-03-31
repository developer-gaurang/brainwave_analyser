import React from "react";
import MudraIcon from "./MudraIcon";

interface RightSidebarProps {
    activeGesture: string | null;
}

const MUDRAS = [
    { name: "Gyan", desc: "Wisdom & Focus" },
    { name: "Prana", desc: "Vitality & Life" },
    { name: "Apana", desc: "Detox & Grounding" },
    { name: "Surya", desc: "Metabolism & Heat" },
    { name: "Varun", desc: "Hydration & Clarity" },
    { name: "Anjali", desc: "Balance & Prayer" },
    { name: "Vayu", desc: "Air & Calm", icon: "/vayu_glow.png" },
    { name: "Shunya", desc: "Space & Ears", icon: "/shunya_glow.png" },
    { name: "Prithvi", desc: "Earth & Strength", icon: "/prithvi_glow.png" },
    { name: "Adi", desc: "Breath & Lungs", icon: "/adi_glow.png" },
    { name: "Chin", desc: "Consciousness", icon: "/chin_glow.png" },
    { name: "Dhyana", desc: "Deep Meditation", icon: "/dhyana_glow.png" },
    { name: "Hakini", desc: "Brain Power", icon: "/hakini_glow.png" },
    { name: "Ganesha", desc: "Obstacle Removal", icon: "/ganesha_glow.png" },
    { name: "Abhaya", desc: "Fearlessness", icon: "/abhaya_glow.png" },
    { name: "Kali", desc: "Transformation", icon: "/kali_glow.png" },
];

export default function RightSidebar({ activeGesture }: RightSidebarProps) {
    return (
        <div className="w-[300px] flex flex-col gap-4 z-20 h-full py-6 pl-4 pointer-events-none">

            {/* Nose Assist: Cinematic Gold Glow */}
            <div className="relative group overflow-hidden rounded-xl p-0.5 animate-pulse-slow flex-none shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 animate-gradient-x opacity-80"></div>
                <div className="relative bg-black/90 backdrop-blur-2xl rounded-lg p-2.5 flex flex-col items-center text-center leading-none border border-white/5">
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-yellow-300 font-black text-[10px] uppercase tracking-[0.4em] mb-1">
                        NOSE ASSIST
                    </h3>
                    <div className="text-[8px] text-white/90 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="h-0.5 w-4 bg-amber-500/50"></span>
                        BREATH SYNC
                        <span className="h-0.5 w-4 bg-amber-500/50"></span>
                    </div>
                </div>
            </div>

            {/* Header: Scanning Status */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl px-4 py-2 shadow-inner flex-none">
                <h2 className="text-white/90 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        GESTURE INDEX
                    </span>
                    <span className="text-[7px] text-cyan-400/80 animate-pulse">SCANNING...</span>
                </h2>
            </div>

            {/* Mudra List: High Precision Instrument Style */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 pr-1 scrollbar-hide pointer-events-auto">
                {MUDRAS.map((m) => {
                    const isActive = activeGesture && activeGesture.includes(m.name);

                    return (
                        <div
                            key={m.name}
                            className={`
                                relative flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-500 overflow-hidden
                                ${isActive
                                    ? "bg-cyan-500/20 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.2)] scale-[1.02] z-10"
                                    : "bg-white/5 border-white/10 opacity-90 hover:opacity-100 hover:bg-white/10 hover:border-white/30"
                                }
                                backdrop-blur-md
                            `}
                        >
                            {/* Scanning Line Effect */}
                            {isActive && (
                                <div className="absolute left-0 right-0 h-[1px] bg-cyan-400/50 shadow-[0_0_10px_cyan] animate-scan z-0 pointer-events-none"></div>
                            )}

                            <div className="flex flex-col min-w-0 relative z-10">
                                <span className={`text-[12px] font-black tracking-widest leading-none truncate ${isActive ? "text-cyan-400" : "text-white"}`}>
                                    {m.name.toUpperCase()}
                                </span>
                                <span className={`text-[8px] uppercase tracking-widest font-bold leading-none mt-1.5 ${isActive ? "text-cyan-300" : "text-white/60"}`}>
                                    {m.desc}
                                </span>
                            </div>

                            <div className={`
                                relative z-10 p-1 rounded-lg transition-all duration-500
                                ${isActive ? "bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "bg-white/10"}
                            `}>
                                <MudraIcon
                                    name={m.name}
                                    isActive={!!isActive}
                                    iconSrc={(m as any).icon}
                                    className={`w-10 h-10 ${isActive ? "" : "opacity-80"}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sensei AI: Bio-Sync Footer */}
            <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl flex-none pointer-events-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                    <div className="flex flex-col">
                        <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em]">SENSEI AI</span>
                        <span className="text-[6px] text-white/40 tracking-[0.2em] font-bold">HYPER-SYNC ACTIVE</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-black border border-cyan-500/30 animate-pulse">
                            BIO-SYNC: 98%
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-white/30 font-black tracking-widest">POSE STATUS</span>
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></span>
                            <span className="text-[10px] text-white font-black tracking-wider">LOTUS</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[7px] text-white/30 font-black tracking-widest">NEURAL FLOW</span>
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_limegreen] animate-pulse"></span>
                            <span className="text-[10px] text-emerald-400 font-black tracking-wider">HARMONIC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
