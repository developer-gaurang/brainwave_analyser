/**
 * AI Coach Panel Component
 * 
 * Beautiful glassmorphic floating panel that displays AI guidance
 * with smooth animations and premium design
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Heart, Zap } from "lucide-react";
import type { SessionPhase } from "../utils/yoga-agent";

interface AICoachPanelProps {
    guidance: string | null;
    sessionPhase: SessionPhase;
    isThinking?: boolean;
    heartRate?: number | null;
    energyLevel?: number;
}

export default function AICoachPanel({
    guidance,
    sessionPhase,
    isThinking = false,
    heartRate,
    energyLevel
}: AICoachPanelProps) {
    const [guidanceHistory, setGuidanceHistory] = useState<string[]>([]);
    const [showPanel, setShowPanel] = useState(false);

    // Update guidance history when new guidance arrives
    useEffect(() => {
        if (guidance && guidance.trim()) {
            setGuidanceHistory(prev => {
                const newHistory = [guidance, ...prev].slice(0, 3); // Keep last 3
                return newHistory;
            });
            setShowPanel(true);
        }
    }, [guidance]);

    // Get phase color and icon
    const getPhaseStyle = (phase: SessionPhase) => {
        switch (phase) {
            case "WARMUP":
                return {
                    color: "from-amber-500/30 to-orange-500/30",
                    border: "border-amber-500/50",
                    glow: "shadow-amber-500/30",
                    icon: <Zap className="w-4 h-4 text-amber-400" />
                };
            case "FLOW":
                return {
                    color: "from-cyan-500/30 to-blue-500/30",
                    border: "border-cyan-500/50",
                    glow: "shadow-cyan-500/30",
                    icon: <Sparkles className="w-4 h-4 text-cyan-400" />
                };
            case "MEDITATION":
                return {
                    color: "from-purple-500/30 to-pink-500/30",
                    border: "border-purple-500/50",
                    glow: "shadow-purple-500/30",
                    icon: <Brain className="w-4 h-4 text-purple-400" />
                };
            case "COOLDOWN":
                return {
                    color: "from-emerald-500/30 to-teal-500/30",
                    border: "border-emerald-500/50",
                    glow: "shadow-emerald-500/30",
                    icon: <Heart className="w-4 h-4 text-emerald-400" />
                };
        }
    };

    const phaseStyle = getPhaseStyle(sessionPhase);

    if (!showPanel && !guidance) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-96"
            >
                {/* Main Panel */}
                <div className={`
                    relative backdrop-blur-xl bg-gradient-to-br ${phaseStyle.color}
                    border ${phaseStyle.border} rounded-2xl
                    shadow-2xl ${phaseStyle.glow}
                    overflow-hidden
                `}>
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                    {/* Glow Effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${phaseStyle.color} blur-xl opacity-30 -z-10`} />

                    {/* Header */}
                    <div className="relative px-4 py-1.5 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{
                                        scale: isThinking ? [1, 1.2, 1] : 1,
                                        rotate: isThinking ? [0, 360] : 0
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: isThinking ? Infinity : 0,
                                        ease: "linear"
                                    }}
                                >
                                    <Brain className="w-5 h-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">AI Yoga Guru</h3>
                                    <p className="text-white/60 text-[10px]">Agentic Intelligence</p>
                                </div>
                            </div>

                            {/* Session Phase Badge */}
                            <div className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full
                                bg-gradient-to-r ${phaseStyle.color}
                                border ${phaseStyle.border}
                            `}>
                                {phaseStyle.icon}
                                <span className="text-white text-xs font-medium uppercase tracking-wider">
                                    {sessionPhase}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bio Stats Bar */}
                    {(heartRate || energyLevel !== undefined) && (
                        <div className="relative px-4 py-1.5 border-b border-white/10 bg-black/20">
                            <div className="flex items-center gap-6 text-sm">
                                {heartRate && (
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                                        <span className="text-white/80">{heartRate} BPM</span>
                                    </div>
                                )}
                                {energyLevel !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-yellow-400" />
                                        <span className="text-white/80 text-xs">{Math.round(energyLevel)}% Energy</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Current Guidance */}
                    <div className="relative px-4 py-2">
                        <AnimatePresence mode="wait">
                            {isThinking ? (
                                <motion.div
                                    key="thinking"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 text-white/60"
                                >
                                    <div className="flex gap-1">
                                        <motion.div
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                            className="w-2 h-2 bg-white/60 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            className="w-2 h-2 bg-white/60 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            className="w-2 h-2 bg-white/60 rounded-full"
                                        />
                                    </div>
                                    <span className="text-sm">AI is contemplating...</span>
                                </motion.div>
                            ) : guidance ? (
                                <motion.div
                                    key={guidance}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <p className="text-white text-xs leading-snug font-light">
                                        {guidance}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-white/40 text-sm italic"
                                >
                                    Observing your practice...
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Guidance History - HIDDEN to save space */}
                    {false && guidanceHistory.length > 1 && (
                        <div className="relative px-4 py-1.5 border-t border-white/10 bg-black/20">
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Recent Guidance</p>
                            <div className="space-y-1">
                                {guidanceHistory.slice(1).map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-white/50 text-[10px] leading-tight pl-2 border-l-2 border-white/20"
                                    >
                                        {msg}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sparkle Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                initial={{
                                    x: Math.random() * 400,
                                    y: Math.random() * 300,
                                    opacity: 0
                                }}
                                animate={{
                                    y: [null, Math.random() * 300 - 150],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Close Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPanel(false)}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                    ✕
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
}
