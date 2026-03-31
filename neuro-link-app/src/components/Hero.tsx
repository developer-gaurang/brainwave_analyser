"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020205]">
            {/* Hyper-Realistic Background Video/Image Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/brain_hero.png"
                    alt="Realistic Neural Interface"
                    fill
                    className="object-cover opacity-60 mix-blend-screen scale-110 lg:scale-100"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205] opacity-80" />
            </div>

            {/* Floating Holographic Elements */}
            <div className="relative z-10 text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-6 inline-flex items-center gap-3 py-1 px-4 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm"
                >
                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Proudly Made in India</span>
                    <div className="flex gap-0.5 h-2 w-4">
                        <div className="flex-1 bg-[#FF9933]"></div>
                        <div className="flex-1 bg-white"></div>
                        <div className="flex-1 bg-[#138808]"></div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black font-sans tracking-tight mb-6 text-white leading-none uppercase"
                >
                    BRAIN<span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-white to-green-500">WAVE</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                    The absolute pinnacle of human-machine integration. Real-time biometric telemetry, decoded by AI, designed for peak biological performance.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-5 justify-center mt-4"
                >
                    <button className="px-10 py-4 bg-cyan-500 text-black font-black rounded-lg hover:bg-white hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-300 uppercase tracking-widest text-sm">
                        Begin Sync
                    </button>
                    <button className="px-10 py-4 border border-white/20 text-white font-black rounded-lg hover:bg-white/5 hover:border-white transition-all duration-300 uppercase tracking-widest text-sm backdrop-blur-md">
                        View Analytics
                    </button>
                </motion.div>
            </div>

            {/* Bottom Scanning Line */}
            <motion.div
                animate={{ translateY: ["0vh", "30vh", "0vh"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.5)] z-20"
            />
        </section>
    );
}
