"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CheckoutButton from "@/components/CheckoutButton";
import LiveDashboard from "@/components/LiveDashboard";
import { Activity, Brain, Heart, Zap, TrendingUp, ShieldCheck } from "lucide-react";

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#020205] text-white selection:bg-cyan-500/30 selection:text-cyan-500 font-sans overflow-hidden">

      {/* 1. Hero Section (Hyper-Realistic Brain Visuals) */}
      <Hero />

      {/* 2. REAL-TIME BRAIN-WAVE ANALYZER SUITE (NEW INTEGRATION) */}
      <section id="analyzer" className="pt-20 pb-32 relative z-10 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 px-6"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic">
              Neural <span className="text-orange-500">Analyzer</span> <span className="text-green-500">Suite</span>
            </h2>
            <p className="text-gray-400 font-bold tracking-[0.3em] uppercase text-xs">Clinical Grade Brain-Wave Decoder // Made in India</p>
          </motion.div>

          <LiveDashboard />
        </div>
      </section>

      {/* 3. Neural Health Checkup (Marketing Dashboard Style) */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            {/* Left Column: Visual Dashboard */}
            <motion.div variants={fadeUp} className="flex-1 w-full relative">
              <div className="absolute -inset-4 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-xl font-bold font-sans tracking-tight">Active Biometrics</h3>
                    <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Live Telemetry Link</p>
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>

                <div className="space-y-8">
                  <MetricRow icon={<Activity className="text-cyan-400" />} label="Alpha Peak" value="10.2 Hz" percent={88} color="bg-cyan-500" />
                  <MetricRow icon={<TrendingUp className="text-purple-400" />} label="Focus Score" value="94/100" percent={94} color="bg-purple-500" />
                  <MetricRow icon={<Heart className="text-emerald-400" />} label="HRV Status" value="72 ms" percent={65} color="bg-emerald-500" />
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Stability</span>
                    <p className="text-xl font-black text-cyan-400">99.2%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Latency</span>
                    <p className="text-xl font-black text-purple-400">4ms</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Copy */}
            <div className="flex-1">
              <motion.div variants={fadeUp}>
                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                  REAL-TIME <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">HEALTH DECODING.</span>
                </h2>
                <p className="text-gray-400 text-xl font-medium mb-10 leading-relaxed">
                  Experience medical-grade precision in your daily workflow. Our interface translates raw EEG data into actionable physiological insights, helping you master your nervous system.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FeatureItem icon={<ShieldCheck className="text-cyan-400" />} title="Secure Link" desc="End-to-end encrypted neural data stream." />
                  <FeatureItem icon={<Zap className="text-purple-400" />} title="Instant Feedback" desc="Sub-millisecond latency for live monitoring." />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Global Feature Grid */}
      <section className="py-24 px-6 relative z-10 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { title: "Electrode Precision", desc: "Proprietary gold-plated sensors for ultra-clear signal acquisition.", icon: "🎯" },
              { title: "Neuro-Buddy AI", desc: "The 'Yogi' agent predicts burnout before it happens.", icon: "🧠" },
              { title: "Clinical Reporting", desc: "Detailed biological performance analysis exported instantly.", icon: "📊" },
            ].map((feature, idx) => (
              <motion.div
                key={idx} variants={fadeUp}
                className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-500 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Pricing / Final CTA */}
      <section className="py-32 relative flex justify-center items-center overflow-hidden">
        {/* Glowing orb background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative z-10 p-[1px] bg-gradient-to-b from-cyan-400/50 to-purple-600/50 rounded-[40px] max-w-xl w-full mx-6 shadow-[0_0_100px_rgba(0,180,255,0.1)]"
        >
          <div className="bg-[#050510] rounded-[39px] p-10 md:p-16 text-center backdrop-blur-3xl">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">The Full Experience</h2>
            <p className="text-gray-400 mb-10 font-bold uppercase tracking-widest text-xs">Complete Biological Performance Kit</p>

            <p className="text-gray-400 mb-8 font-medium italic">"Order the complete Indian-engineered kit at ₹8,000 only. If you already have the kit, initialize your analyzer below."</p>

            <div className="text-7xl font-black text-white mb-10 tracking-tighter">
              ₹8,000
            </div>

            <CheckoutButton />

            <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-80 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              MADE IN INDIA
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm bg-black/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-bold uppercase tracking-widest text-[11px]">© {new Date().getFullYear()} BRAINWAVE ANALYZER. ENGINEERED IN INDIA BY THE DEBUGGERS SQUAD.</p>
          <div className="flex gap-8 font-black uppercase text-[10px] tracking-widest">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-green-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- Internal Helper Components ---

function MetricRow({ icon, label, value, percent, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-sm font-black text-white">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
        />
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-bold text-white mb-1 uppercase tracking-tight">{title}</h4>
        <p className="text-sm text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}
