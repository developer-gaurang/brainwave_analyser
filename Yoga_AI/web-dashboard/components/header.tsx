"use client";

import { Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
    connected: boolean;
}

export function Header({ connected }: HeaderProps) {
    return (
        <header className="flex justify-between items-center mb-6 glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center glow-cyan shadow-[0_0_15px_#00f0ff]">
                    <span className="text-xl font-bold text-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>🧠</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-wider text-white neon-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        BRAINWAVE ANALYZER
                    </h1>
                    <p className="text-xs text-neon-cyan tracking-[0.2em] opacity-80">NEUROFEEDBACK SYSTEM V4.0</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${connected ? 'border-neon-green bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    {connected ? <Wifi size={16} className="text-neon-green" /> : <WifiOff size={16} className="text-red-500" />}
                    <span className={`text-xs font-mono font-bold ${connected ? 'text-neon-green' : 'text-red-500'}`}>
                        {connected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>
        </header>
    );
}
