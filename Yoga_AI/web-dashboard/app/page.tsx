"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { NeuroWaveform } from '@/components/waveform';
import { MetricsGrid } from '@/components/metrics';
import { BrainRadar } from '@/components/radar';
import { useBrainData } from '@/hooks/useBrainData';

export default function Home() {
  const { data, connected } = useBrainData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration error

  const metrics = data?.metrics || {
    relaxation_score: 0,
    pump_active: false,
    bpm: "--",
    activations: 0
  };

  const bands = data?.bands || { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0 };
  const waveform = data?.waveform || [];

  return (
    <main className="min-h-screen p-6 bg-[#050510] relative overflow-hidden font-rajdhani">
      {/* Cyberpunk Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.03) 0%, rgba(5, 5, 16, 1) 70%)'
      }} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <Header connected={connected} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Monitor (2/3) */}
          <div className="lg:col-span-2 space-y-6 h-full flex flex-col">
            {/* Waveform */}
            <div className="flex-1 min-h-[300px]">
              <NeuroWaveform data={waveform} />
            </div>
          </div>

          {/* Right Panel (1/3) */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <MetricsGrid metrics={metrics} />

            {/* Radar Analysis */}
            <BrainRadar bands={bands} />

            {/* Mini Console Log */}
            <div className="glass-panel p-4 rounded-xl min-h-[150px] font-mono text-xs text-slate-400 overflow-hidden">
              <div className="text-neon-cyan mb-2 border-b border-gray-800 pb-1">AI NEURO-LOG</div>
              <div className="space-y-1">
                {connected ? (
                  <>
                    <div><span className="text-green-500">[SYS]</span> Uplink established.</div>
                    <div><span className="text-blue-500">[DAT]</span> Buffered 500 samples.</div>
                    {metrics.pump_active && <div><span className="text-neon-green">[ACT]</span> Pump ACTIVATED - Flow State.</div>}
                  </>
                ) : (
                  <div className="text-red-500 animate-pulse">[ERR] Connection lost. Retrying...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
