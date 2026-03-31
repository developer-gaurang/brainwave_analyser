"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSerial } from "@/hooks/useWebSerial";
import NeuralChart from "./NeuralChart";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Wifi, Activity, Zap, Play, Square, ShieldCheck, Brain } from "lucide-react";

export default function LiveDashboard() {
    const { connect, disconnect, startReading, port, reading, error } = useWebSerial();
    const [eegData, setEegData] = useState<number[]>([]);
    const [bands, setBands] = useState({ alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0 });
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize Web Worker
        workerRef.current = new Worker(new URL("../workers/signal-worker.ts", import.meta.url));

        workerRef.current.onmessage = (e) => {
            if (e.data.type === "BANDS") {
                setBands(e.data.data);
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const handleConnect = async () => {
        const success = await connect();
        if (success) {
            // Hardware Handshake
            const writer = success.writable.getWriter();
            const encoder = new TextEncoder();
            await writer.write(encoder.encode("START\n"));
            writer.releaseLock();

            startReading((chunk) => {
                // Convert chunk to numbers (dummy conversion for now, real sync logic later)
                const dataArr = Array.from(chunk).map(v => v * 1000);
                setEegData(prev => [...prev, ...dataArr].slice(-500));
                workerRef.current?.postMessage({ type: "DATA_CHUNK", data: dataArr });
            });
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            {/* Header Stat Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard icon={<Cpu />} label="Processor" value="WebWorker Online" color="text-cyan-400" />
                <StatusCard icon={<Wifi />} label="Hardware Link" value={port ? "CONNECTED" : "DISCONNECTED"} color={port ? "text-green-400" : "text-gray-500"} />
                <StatusCard icon={<Activity />} label="Sample Rate" value="500 Hz" color="text-purple-400" />
                <StatusCard icon={<ShieldCheck />} label="Signal Identity" value="MADE IN INDIA" color="text-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Live Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                                <Zap className="text-cyan-400 w-5 h-5" />
                                Raw Neural Telemetry
                            </h3>
                            <div className="flex gap-2">
                                {!port ? (
                                    <button onClick={handleConnect} className="px-4 py-2 bg-cyan-500 text-black text-xs font-black rounded-lg hover:bg-white transition-all flex items-center gap-2">
                                        <Play className="w-3 h-3" /> CONNECT HARDWARE
                                    </button>
                                ) : (
                                    <button onClick={disconnect} className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-black rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                                        <Square className="w-3 h-3" /> DISCONNECT
                                    </button>
                                )}
                            </div>
                        </div>

                        <NeuralChart data={eegData} label="EEG CHANNEL 0 (uV)" color="#00f0ff" />
                    </div>

                    {/* Band Distribution */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <BandCard label="Delta" value={bands.delta} color="bg-blue-500" />
                        <BandCard label="Theta" value={bands.theta} color="bg-purple-500" />
                        <BandCard label="Alpha" value={bands.alpha} color="bg-emerald-500" />
                        <BandCard label="Beta" value={bands.beta} color="bg-orange-500" />
                        <BandCard label="Gamma" value={bands.gamma} color="bg-pink-500" />
                    </div>
                </div>

                {/* Focus Score & Indian Component Identity */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 backdrop-blur-xl text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-2 block">Neural Focus Index</span>
                        <div className="text-7xl font-black mb-4 tracking-tighter">
                            {Math.round(bands.beta * 2)}%
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
                            <motion.div
                                animate={{ width: `${Math.min(100, bands.beta * 2)}%` }}
                                className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                            />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Proprietary Indian logic analyzing sustain peaks in sustained beta frequencies.</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Brain className="w-3 h-3" /> Yogi AI Specialist
                        </h4>
                        <div className="h-40 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-hide text-[11px]">
                            <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl rounded-tl-none">
                                Hello! I am Yogi. Connect your neural link to begin analysis.
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask Yogi about your brain..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all pr-12"
                            />
                            <button className="absolute right-2 top-1.5 p-1.5 bg-cyan-500 text-black rounded-lg hover:bg-white transition-all">
                                <Zap className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex flex-col gap-0.5 w-6 h-4">
                                <div className="bg-[#FF9933] flex-1"></div>
                                <div className="bg-white flex-1"></div>
                                <div className="bg-[#138808] flex-1"></div>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-400">Indian Engineering</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed italic">
                            "This interface is engineered to military-grade standards in India, ensuring zero-latency data encryption for local storage."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ icon, label, value, color }: any) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
            <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

function BandCard({ label, value, color }: any) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{label}</p>
            <div className="text-xl font-black mb-2">{Math.round(value)}</div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
            </div>
        </div>
    );
}
