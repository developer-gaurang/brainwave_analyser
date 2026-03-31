"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
}

interface LandingPageProps {
    onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation
        setTimeout(() => setIsLoaded(true), 100);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Initialize particles
        const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2,
        }));

        // Animation loop
        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particlesRef.current.forEach((particle) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Update twinkle
                particle.twinklePhase += particle.twinkleSpeed;
                const twinkle = Math.sin(particle.twinklePhase) * 0.3 + 0.7;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(135, 206, 250, ${particle.opacity * twinkle})`;
                ctx.fill();

                // Add glow for larger particles
                if (particle.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(
                        particle.x,
                        particle.y,
                        0,
                        particle.x,
                        particle.y,
                        particle.size * 2
                    );
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * twinkle * 0.3})`);
                    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0f0520]">
            {/* Particle Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
            />

            {/* Central Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
                style={{
                    background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(138,43,226,0.2) 50%, transparent 70%)",
                    zIndex: 2,
                }}
            />

            {/* Content Container */}
            <div
                className={`relative z-10 flex flex-col items-center justify-center h-full transition-all duration-1500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                {/* Om Symbol with Ring */}
                <div className="relative mb-8">
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 flex items-center justify-center animate-rotate-ring">
                        <div className="w-48 h-48 rounded-full border-4 border-transparent border-t-yellow-500 border-r-yellow-400 opacity-60" />
                    </div>

                    {/* Om Symbol */}
                    <div className="relative flex items-center justify-center w-48 h-48 animate-pulse-glow">
                        <div
                            className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-400"
                            style={{
                                textShadow: "0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4)",
                                fontFamily: "serif",
                            }}
                        >
                            ॐ
                        </div>
                    </div>

                    {/* Inner Glow */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-40 blur-2xl animate-pulse-slow"
                        style={{
                            background: "radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)",
                        }}
                    />
                </div>

                {/* Title */}
                <h1
                    className={`text-6xl md:text-7xl font-bold text-white mb-4 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                    style={{
                        textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                        fontFamily: "var(--font-geist-sans)",
                    }}
                >
                    Yoga AI
                </h1>

                {/* Subtitle */}
                <p
                    className={`text-xl md:text-2xl text-blue-200 mb-12 text-center px-4 transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                    style={{
                        textShadow: "0 0 10px rgba(135, 206, 250, 0.5)",
                    }}
                >
                    Awaken Your Inner Energy • Master Ancient Wisdom
                </p>

                {/* Begin Journey Button */}
                <button
                    onClick={onEnter}
                    className={`group relative px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-full overflow-hidden transition-all duration-1000 delay-700 hover:scale-110 hover:shadow-2xl ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                    style={{
                        boxShadow: "0 0 30px rgba(138, 43, 226, 0.5)",
                    }}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer" />

                    {/* Button Text */}
                    <span className="relative z-10">Begin Your Journey</span>

                    {/* Glow on Hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400" />
                </button>

                {/* Floating Hint */}
                <p
                    className={`mt-8 text-sm text-gray-400 animate-pulse transition-all duration-1000 delay-1000 ${isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                >
                    Press 'S' during your session to capture screenshots
                </p>
            </div>

            {/* Bottom Silhouette (Optional - can be enabled later) */}
            {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 opacity-20">
        <div className="w-full h-full bg-gradient-to-t from-black to-transparent" />
      </div> */}
        </div>
    );
}
