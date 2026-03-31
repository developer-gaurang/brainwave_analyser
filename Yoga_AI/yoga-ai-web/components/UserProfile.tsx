/**
 * User Profile Dropdown
 * 
 * Displays user info and quick stats in TopBar
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, TrendingUp, Award, Calendar } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface UserProfileProps {
    onOpenProgress?: () => void;
}

export default function UserProfile({ onOpenProgress }: UserProfileProps) {
    const { user, profile, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user || !profile) return null;

    const displayName = profile.name || user.displayName || "Yogi";
    const photoURL = profile.photoURL || user.photoURL;

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
                {photoURL ? (
                    <img
                        src={photoURL}
                        alt={displayName}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                )}
                <span className="text-white font-medium hidden sm:block">{displayName}</span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-72 z-50"
                        >
                            {/* Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-xl opacity-75 rounded-2xl" />

                            {/* Card */}
                            <div className="relative backdrop-blur-3xl bg-gradient-to-br from-black/90 to-black/70 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="p-4 border-b border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        {photoURL ? (
                                            <img
                                                src={photoURL}
                                                alt={displayName}
                                                className="w-12 h-12 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-semibold">{displayName}</p>
                                            <p className="text-white/60 text-sm">{profile.email}</p>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-white/5 rounded-lg p-2 text-center">
                                            <p className="text-cyan-400 font-bold text-lg">{profile.stats.totalSessions}</p>
                                            <p className="text-white/60 text-xs">Sessions</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 text-center">
                                            <p className="text-purple-400 font-bold text-lg">{profile.stats.totalMinutes}</p>
                                            <p className="text-white/60 text-xs">Minutes</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 text-center">
                                            <p className="text-pink-400 font-bold text-lg">{profile.stats.currentStreak}</p>
                                            <p className="text-white/60 text-xs">Streak</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="p-2">
                                    {onOpenProgress && (
                                        <button
                                            onClick={() => {
                                                onOpenProgress();
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                                        >
                                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                                            <span>View Progress</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                                    >
                                        <Award className="w-5 h-5 text-purple-400" />
                                        <span>Achievements</span>
                                        <span className="ml-auto text-xs text-white/40">Coming Soon</span>
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition-colors"
                                    >
                                        <Calendar className="w-5 h-5 text-pink-400" />
                                        <span>Session History</span>
                                        <span className="ml-auto text-xs text-white/40">Coming Soon</span>
                                    </button>
                                </div>

                                {/* Sign Out */}
                                <div className="p-2 border-t border-white/10">
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
