"use client";

import { useEffect, useRef } from "react";

interface NeuralChartProps {
    data: number[];
    color?: string;
    label?: string;
    maxPoints?: number;
}

export default function NeuralChart({ data, color = "#00f0ff", label, maxPoints = 500 }: NeuralChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Draw Grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let i = 0; i < height; i += 20) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
                ctx.stroke();
            }

            // Draw Signal
            if (data.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.lineJoin = "round";

                const step = width / (maxPoints - 1);
                const middle = height / 2;
                const scale = height / 1000000; // Adjusted for uV range

                ctx.moveTo(0, middle - data[0] * scale);

                for (let i = 1; i < data.length; i++) {
                    ctx.lineTo(i * step, middle - data[i] * scale);
                }
                ctx.stroke();

                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = color;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            requestAnimationFrame(render);
        };

        const animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [data, color, maxPoints]);

    return (
        <div className="relative w-full h-48 bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
            {label && (
                <div className="absolute top-3 left-4 z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
                </div>
            )}
            <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full h-full"
            />
        </div>
    );
}
