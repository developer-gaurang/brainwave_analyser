"use client";

import { Activity, Droplets, Zap, Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricsGridProps {
    metrics: {
        relaxation_score: number;
        pump_active: boolean;
        bpm: number | string;
        activations: number;
    }
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
    const { relaxation_score, pump_active, bpm, activations } = metrics;

    // Derived state
    const isRelaxed = relaxation_score > 0.35;
    const scorePercent = Math.round(relaxation_score * 100);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Relaxation Score */}
            <MetricCard
                label="RELAXATION INDEX"
                value={scorePercent.toString()}
                unit="%"
                icon={<Zap size={18} />}
                color={isRelaxed ? "text-neon-green" : "text-neon-cyan"}
                glow={isRelaxed}
                subtext={isRelaxed ? "Flow Step Active" : "Active Focus"}
            />

            {/* Pump Status */}
            <MetricCard
                label="PUMP STATUS"
                value={pump_active ? "ACTIVE" : "STANDBY"}
                unit=""
                icon={<Droplets size={18} />}
                color={pump_active ? "text-neon-green" : "text-gray-400"}
                glow={pump_active}
                subtext={`Tot: ${activations} cycles`}
                borderColor={pump_active ? "border-neon-green" : undefined}
            />

            {/* Heart Rate */}
            <MetricCard
                label="HEART RATE"
                value={bpm.toString()}
                unit="BPM"
                icon={<Heart size={18} />}
                color="text-neon-red"
                glow={false}
                subtext="Simulated Vitals"
            />

            {/* Stability */}
            <MetricCard
                label="STABILITY"
                value={isRelaxed ? "HIGH" : "MODERATE"}
                unit=""
                icon={<Activity size={18} />}
                color="text-neon-purple"
                glow={false}
                subtext="Cognitive Load"
            />
        </div>
    );
}

interface CardProps {
    label: string;
    value: string;
    unit?: string;
    icon: React.ReactNode;
    color: string;
    glow?: boolean;
    subtext?: string;
    borderColor?: string;
}

function MetricCard({ label, value, unit, icon, color, glow, subtext, borderColor }: CardProps) {
    return (
        <div className={clsx(
            "glass-panel rounded-xl p-4 flex flex-col justify-between transition-all duration-300",
            glow && "glow-green",
            borderColor && `border ${borderColor}`
        )}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-slate-400 tracking-wider">{label}</span>
                <span className={color}>{icon}</span>
            </div>

            <div className="flex items-baseline gap-1">
                <span className={clsx("text-3xl font-bold font-mono", color, glow && "neon-text")}>
                    {value}
                </span>
                {unit && <span className="text-sm text-slate-500 font-mono">{unit}</span>}
            </div>

            {subtext && (
                <div className="mt-2 text-xs text-slate-500 font-mono">
                    {subtext}
                </div>
            )}
        </div>
    );
}
