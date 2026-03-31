"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface BrainRadarProps {
    bands: {
        delta: number;
        theta: number;
        alpha: number;
        beta: number;
        gamma: number;
    }
}

export function BrainRadar({ bands }: BrainRadarProps) {
    // Normalize data for chart? Or just use raw relative power
    const data = [
        { subject: 'Delta', A: bands.delta, fullMark: 100 },
        { subject: 'Theta', A: bands.theta, fullMark: 100 },
        { subject: 'Alpha', A: bands.alpha, fullMark: 100 },
        { subject: 'Beta', A: bands.beta, fullMark: 100 },
        { subject: 'Gamma', A: bands.gamma, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[250px] glass-panel rounded-xl p-2 relative">
            <div className="absolute top-2 left-4 text-xs font-mono text-cyan-400 opacity-70 z-10">
                BRAIN BALANCE RADAR
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar
                        name="Brain"
                        dataKey="A"
                        stroke="#00ff41"
                        strokeWidth={2}
                        fill="#00ff41"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
