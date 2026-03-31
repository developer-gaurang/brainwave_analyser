"use client";

import { useEffect, useRef } from 'react';

interface WaveformProps {
    data: number[];
    color?: string;
}

export function NeuroWaveform({ data, color = '#00f0ff' }: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Style
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Gradients
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, hexToRgba(color, 0.4));
        gradient.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = gradient;

        // Draw Line
        if (data.length > 0) {
            ctx.beginPath();

            const step = width / (data.length - 1);

            // Find min/max for auto-scaling or use fixed range
            // EEG data is usually around 0-1000uV? The bridge sends raw values.
            // Let's assume range 0-1000 roughly, centered at 500?
            // Or auto-scale based on last chunk.
            // Implementation: Auto-scale with some smoothing

            const maxVal = Math.max(...data, 100);
            const minVal = Math.min(...data, 0);
            const range = maxVal - minVal || 1;

            data.forEach((val, i) => {
                const x = i * step;
                // Normalize to height
                const normalized = (val - minVal) / range;
                const y = height - (normalized * height * 0.8) - (height * 0.1); // 10% padding

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.stroke();

            // Fill area
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();
        }

    }, [data, color]);

    return (
        <div className="w-full h-full relative glass-panel rounded-xl overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute top-2 left-4 text-xs font-mono text-cyan-400 opacity-70">
                NEURAL WAVEFORM (Live Buffer)
            </div>
        </div>
    );
}

// Helper
function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
