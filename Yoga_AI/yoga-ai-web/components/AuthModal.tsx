/**
 * Auth Modal Component
 * 
 * Beautiful onboarding modal for user authentication
 * with glassmorphic design and smooth animations
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { googleSignIn, emailSignIn, emailSignUp, error } = useAuth();
    const [mode, setMode] = useState<"welcome" | "signin" | "signup">("welcome");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await googleSignIn();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await emailSignIn(formData.email, formData.password);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await emailSignUp(formData.email, formData.password, formData.name);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md mx-4"
                >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-2xl opacity-75 rounded-3xl" />

                    {/* Main Card */}
                    <div className="relative backdrop-blur-3xl bg-gradient-to-br from-black/80 to-black/60 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    initial={{
                                        x: Math.random() * 400,
                                        y: Math.random() * 600,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: [null, Math.random() * 600 - 300],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                />
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Content */}
                        <div className="relative p-8">
                            <AnimatePresence mode="wait">
                                {mode === "welcome" && (
                                    <motion.div
                                        key="welcome"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="text-center"
                                    >
                                        {/* Logo/Icon */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="inline-block mb-6"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                                <Sparkles className="w-10 h-10 text-white" />
                                            </div>
                                        </motion.div>

                                        <h2 className="text-3xl font-bold text-white mb-3">
                                            Welcome to Yoga AI
                                        </h2>
                                        <p className="text-white/60 mb-8">
                                            Your intelligent yoga companion powered by AI
                                        </p>

                                        {/* Google Sign-In */}
                                        <button
                                            onClick={handleGoogleSignIn}
                                            disabled={loading}
                                            className="w-full mb-4 px-6 py-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            {loading ? "Signing in..." : "Continue with Google"}
                                        </button>

                                        {/* Divider */}
                                        <div className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-white/20" />
                                            <span className="text-white/40 text-sm">or</span>
                                            <div className="flex-1 h-px bg-white/20" />
                                        </div>

                                        {/* Email Options */}
                                        <button
                                            onClick={() => setMode("signup")}
                                            className="w-full mb-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all transform hover:scale-105"
                                        >
                                            Sign Up with Email
                                        </button>
                                        <button
                                            onClick={() => setMode("signin")}
                                            className="w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all"
                                        >
                                            Sign In with Email
                                        </button>
                                    </motion.div>
                                )}

                                {mode === "signup" && (
                                    <motion.div
                                        key="signup"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
                                        <form onSubmit={handleEmailSignUp} className="space-y-4">
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Name</label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Your name"
                                                        required
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="your@email.com"
                                                        required
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <input
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        placeholder="••••••••"
                                                        required
                                                        minLength={6}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? "Creating account..." : "Create Account"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setMode("welcome")}
                                                className="w-full text-white/60 hover:text-white text-sm transition-colors"
                                            >
                                                ← Back
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {mode === "signin" && (
                                    <motion.div
                                        key="signin"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
                                        <form onSubmit={handleEmailSignIn} className="space-y-4">
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="your@email.com"
                                                        required
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-sm mb-2">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <input
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        placeholder="••••••••"
                                                        required
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? "Signing in..." : "Sign In"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setMode("welcome")}
                                                className="w-full text-white/60 hover:text-white text-sm transition-colors"
                                            >
                                                ← Back
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
