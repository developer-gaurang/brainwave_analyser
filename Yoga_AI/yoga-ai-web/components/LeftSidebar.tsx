import React from "react";

interface LeftSidebarProps {
    energies: number[];
}

const CHAKRAS = [
    { name: "Root", color: "#FF0000", label: "Muladhara" },
    { name: "Sacral", color: "#FF8C00", label: "Svadhishthana" },
    { name: "Solar", color: "#FFFF00", label: "Manipura" },
    { name: "Heart", color: "#00FF00", label: "Anahata" },
    { name: "Throat", color: "#0000FF", label: "Vishuddha" },
    { name: "Third", color: "#4B0082", label: "Ajna" },
    { name: "Crown", color: "#8B00FF", label: "Sahasrara" },
];

export default function LeftSidebar({ energies }: LeftSidebarProps) {
    return (
        <div className="w-[180px] flex flex-col justify-between gap-4 z-20 h-full py-2 pr-2">
            {CHAKRAS.map((c, i) => {
                const energy = energies[i] ?? 0.0;
                const height = Math.max(10, energy * 100); // Min height 10%
                const isActive = energy > 0.02; // Lower threshold for "active" look

                return (
                    <div key={c.name} className="flex-1 flex flex-row items-center gap-4 group">
                        {/* Energy Bar Container */}
                        <div className="h-full w-10 bg-black/80 rounded-full relative overflow-hidden backdrop-blur-xl border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:w-11 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            {/* Glowing Fill */}
                            <div
                                className="absolute bottom-0 w-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    height: `${height}%`,
                                    background: `linear-gradient(to top, ${c.color}, white)`,
                                    boxShadow: `0 0 20px ${c.color}, 0 0 40px ${c.color}`,
                                    opacity: energy > 0.01 ? 1 : 0.4
                                }}
                            />

                            {/* Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

                            {/* Glass Reflection Line */}
                            <div className="absolute top-0 left-2 w-1 h-full bg-white/20 blur-[1px]"></div>
                        </div>

                        {/* Label */}
                        <div className="flex flex-col justify-center">
                            <span
                                className="text-sm font-black uppercase tracking-widest transition-all duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]"
                                style={{
                                    color: energy > 0.05 ? '#ffffff' : '#dddddd',
                                    textShadow: energy > 0.05 ? `0 0 10px ${c.color}` : `0 0 5px ${c.color}66`,
                                    transform: isActive ? 'scale(1.1) translateX(5px)' : 'scale(1.0)'
                                }}
                            >
                                {c.name}
                            </span>
                            <span className="text-[10px] text-white/80 font-bold tracking-widest group-hover:text-cyan-400 transition-colors uppercase drop-shadow-sm">
                                {c.label}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <div
                                    className="h-2 w-2 rounded-full animate-pulse blur-[1px]"
                                    style={{
                                        backgroundColor: c.color,
                                        boxShadow: `0 0 10px ${c.color}`
                                    }}
                                ></div>
                                <span className="text-[11px] font-mono font-black tracking-tighter" style={{ color: energy > 0.05 ? '#ffffff' : c.color }}>
                                    {Math.round(energy * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
