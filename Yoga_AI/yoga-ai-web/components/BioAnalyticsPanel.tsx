import React, { useEffect, useRef } from 'react';
import { BILINGUAL_STATS_DESCRIPTIONS } from '../utils/chakra-data';

interface BioAnalyticsPanelProps {
    heartRate: number;
    spo2: number;
    beatDetected: boolean;
    energyLevel: number;
    stressLevel: number;
    focusScore: number;
    isConnected: boolean;
    hrvIndex: number;
    doshas: { vata: number; pitta: number; kapha: number; };
    insightText: string;
    finding: string;
    onConnect?: () => void;
}

export default function BioAnalyticsPanel({
    heartRate,
    spo2,
    beatDetected,
    energyLevel,
    stressLevel,
    focusScore,
    isConnected,
    hrvIndex,
    doshas,
    insightText,
    finding,
    onConnect
}: BioAnalyticsPanelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Data Refs (for performance)
    const heartRateRef = useRef(heartRate);
    const spo2Ref = useRef(spo2);
    const beatDetectedRef = useRef(beatDetected);
    const energyLevelRef = useRef(energyLevel);
    const stressLevelRef = useRef(stressLevel);
    const focusScoreRef = useRef(focusScore);
    const hrvIndexRef = useRef(hrvIndex);
    const doshasRef = useRef(doshas);
    const insightTextRef = useRef(insightText);
    const findingRef = useRef(finding);

    // Update refs when props change
    useEffect(() => {
        heartRateRef.current = heartRate;
        spo2Ref.current = spo2;
        beatDetectedRef.current = beatDetected;
        energyLevelRef.current = energyLevel;
        stressLevelRef.current = stressLevel;
        focusScoreRef.current = focusScore;
        hrvIndexRef.current = hrvIndex;
        doshasRef.current = doshas;
        insightTextRef.current = insightText;
        findingRef.current = finding;
    }, [heartRate, spo2, beatDetected, energyLevel, stressLevel, focusScore, hrvIndex, doshas, insightText, finding]);

    // Animation Refs
    const pulseDataRef = useRef<number[]>(new Array(100).fill(0));
    const hrvDataRef = useRef<number[]>(new Array(50).fill(0));
    const pranaDataRef = useRef<number[]>(new Array(100).fill(0));
    const focusDataRef = useRef<number[]>(new Array(100).fill(0.5));
    const hrvIndexDataRef = useRef<number[]>(new Array(100).fill(0.5));

    // Dosha History Refs
    const vataHistoryRef = useRef<number[]>([]);
    const pittaHistoryRef = useRef<number[]>([]);
    const kaphaHistoryRef = useRef<number[]>([]);

    const phaseRef = useRef(0);
    const animationFrameRef = useRef<number>(0);

    // Bot Animation Refs
    const botBlinkTimerRef = useRef(0);
    const botLookCycleRef = useRef(0);
    const typingCharCountRef = useRef(0);
    const lastInsightTextRef = useRef("");

    // Voice State
    const lastSpeakTimeRef = useRef(0);
    const currentSpeakingGraphRef = useRef<string | null>(null);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop current
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slower for clarity
            // Try to find a female voice or Hindi voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Google') || v.name.includes('Female'));
            if (preferredVoice) utterance.voice = preferredVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = Date.now();

        // Debounce: 5 seconds between repeats
        if (now - lastSpeakTimeRef.current < 5000) return;

        // Regions (aligned with drawing logic)
        const graphW = 270;
        const graphH = 40;
        const startY = 100;
        const gap = 8;
        const graphX = 15;

        // Check if hovering specific graphs
        const checkRegion = (index: number, key: string, label: string) => {
            const gy = startY + index * (graphH + gap);
            if (x >= graphX && x <= graphX + graphW && y >= gy && y <= gy + graphH) {
                if (currentSpeakingGraphRef.current !== key) {
                    // @ts-ignore
                    const text = BILINGUAL_STATS_DESCRIPTIONS[key];
                    if (text) {
                        speak(text);
                        lastSpeakTimeRef.current = now;
                        currentSpeakingGraphRef.current = key;
                    }
                }
                return true;
            }
            return false;
        };

        if (checkRegion(0, 'heartRhythm', 'Heart Rhythm')) return;
        if (checkRegion(1, 'stressLevel', 'Stress Level')) return;
        if (checkRegion(2, 'pranaEnergy', 'Prana Energy')) return;
        if (checkRegion(3, 'focusLevel', 'Focus Level')) return;
        if (checkRegion(4, 'hrvIndex', 'HRV Index')) return;

        // Nadi Pariksha
        const tgY = startY + (graphH + gap) * 5 + 15;
        if (y >= tgY && y <= tgY + 30) {
            if (currentSpeakingGraphRef.current !== 'nadiPariksha') {
                speak(BILINGUAL_STATS_DESCRIPTIONS.nadiPariksha);
                lastSpeakTimeRef.current = now;
                currentSpeakingGraphRef.current = 'nadiPariksha';
            }
            return;
        }

        // Energy Coherence (Radar)
        const guideY = tgY + 55;
        const coherenceY = guideY + 50;
        const coherenceX = 150; // Center of panelW (300)
        const dist = Math.sqrt(Math.pow(x - coherenceX, 2) + Math.pow(y - coherenceY, 2));
        if (dist < 40) {
            if (currentSpeakingGraphRef.current !== 'energyCoherence') {
                speak(BILINGUAL_STATS_DESCRIPTIONS.energyCoherence);
                lastSpeakTimeRef.current = now;
                currentSpeakingGraphRef.current = 'energyCoherence';
            }
            return;
        }

        // Reset if hovering nothing
        currentSpeakingGraphRef.current = null;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            phaseRef.current += 0.1;
            const w = canvas.width;
            const h = canvas.height;

            // Clear
            ctx.clearRect(0, 0, w, h);

            // --- UPDATE DATA ---

            // 1. Pulse (ECG)
            if (beatDetectedRef.current) {
                pulseDataRef.current.push(-0.5, 1.0, -0.2); // Beat spike
            } else {
                pulseDataRef.current.push(Math.random() * 0.05 - 0.025); // Noise
            }
            while (pulseDataRef.current.length > 100) pulseDataRef.current.shift();

            // 2. HRV (Stress Bars)
            const stressNoise = Math.random() * stressLevelRef.current;
            hrvDataRef.current.push(stressNoise);
            while (hrvDataRef.current.length > 50) hrvDataRef.current.shift();

            // 3. Prana (Energy Wave)
            const breath = Math.sin(phaseRef.current * 0.2) * 0.1;
            pranaDataRef.current.push(energyLevelRef.current + breath);
            while (pranaDataRef.current.length > 100) pranaDataRef.current.shift();

            // 4. Focus (Beam)
            const wobble = (1.0 - focusScoreRef.current) * 0.2;
            const focusVal = 0.5 + Math.sin(phaseRef.current * 0.5) * wobble + (Math.random() - 0.5) * wobble;
            focusDataRef.current.push(focusVal);
            while (focusDataRef.current.length > 100) focusDataRef.current.shift();

            // 5. HRV Index
            hrvIndexDataRef.current.push(Math.min(1, Math.max(0, (hrvIndexRef.current - 20) / 80)));
            while (hrvIndexDataRef.current.length > 100) hrvIndexDataRef.current.shift();

            // 6. Dosha History
            if (doshasRef.current) {
                vataHistoryRef.current.push(doshasRef.current.vata);
                pittaHistoryRef.current.push(doshasRef.current.pitta);
                kaphaHistoryRef.current.push(doshasRef.current.kapha);
                if (vataHistoryRef.current.length > 20) vataHistoryRef.current.shift();
                if (pittaHistoryRef.current.length > 20) pittaHistoryRef.current.shift();
                if (kaphaHistoryRef.current.length > 20) kaphaHistoryRef.current.shift();
            }

            // --- DRAWING ---

            // Helper to draw graph in a box
            const drawGraph = (
                label: string,
                data: number[],
                x: number, y: number, width: number, height: number,
                color: string,
                style: 'line' | 'bars' | 'fill' | 'beam' | 'area'
            ) => {
                // Background (Glass look)
                ctx.save();
                ctx.fillStyle = 'rgba(10, 15, 25, 0.7)';
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, 4);
                ctx.fill();

                // Subtle Border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Label with Shadow
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'black';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = 'bold 10px monospace';
                ctx.fillText(label, x + 8, y + 14);
                ctx.restore();

                if (style === 'bars') {
                    const barW = Math.max(1, width / data.length);
                    data.forEach((val, i) => {
                        const barH = val * height * 0.7;
                        const bx = x + i * barW;
                        const by = y + height - barH;

                        let c = color;
                        if (val > 0.6) c = '#ff3333'; // Hot Red
                        else if (val > 0.3) c = '#00f2ff'; // Neon Cyan

                        ctx.save();
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = c;
                        ctx.fillStyle = c;
                        ctx.fillRect(bx, by, barW - 1, barH);
                        ctx.restore();
                    });
                } else {
                    ctx.save();
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = style === 'beam' ? 3 : 2;
                    ctx.shadowBlur = style === 'beam' || style === 'line' ? 12 : 5;
                    ctx.shadowColor = color;

                    data.forEach((val, i) => {
                        const px = x + (i / data.length) * width;
                        let py = y + height / 2;

                        if (style === 'line') { // ECG
                            py = y + height / 2 - (val * height * 0.45);
                        } else if (style === 'fill' || style === 'area' || style === 'beam') {
                            py = y + height - (val * height * 0.85);
                        }

                        py = Math.max(y + 2, Math.min(y + height - 2, py));

                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    });
                    ctx.stroke();

                    if (style === 'fill' || style === 'area') {
                        ctx.lineTo(x + width, y + height);
                        ctx.lineTo(x, y + height);
                        const areaGrad = ctx.createLinearGradient(x, y, x, y + height);
                        areaGrad.addColorStop(0, color.replace('1)', '0.4)').replace('rgb', 'rgba'));
                        areaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        ctx.fillStyle = areaGrad;
                        ctx.fill();
                    }

                    if (style === 'beam' || style === 'line') {
                        // Sharp White Core for neon effect
                        ctx.shadowBlur = 0;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 0.5;
                        ctx.stroke();
                    }
                    ctx.restore();
                }
            };

            const graphH = 40; // Reduced height
            const gap = 8; // Reduced gap
            const startY = 100; // Moved up
            const panelW = 300; // Reduced width
            const graphW = panelW - 30;
            const graphX = 15;

            // 1. PREMIUM HEART RHYTHM GRAPH (ECG Style)
            // Enhanced aesthetics with multi-layer effects
            const drawPremiumHeartRhythm = () => {
                const x = graphX;
                const y = startY;
                const width = graphW;
                const height = graphH;

                // Background with subtle grid (ECG paper style)
                ctx.save();
                ctx.fillStyle = 'rgba(5, 10, 20, 0.9)';
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, 6);
                ctx.fill();

                // Grid lines (subtle)
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
                ctx.lineWidth = 0.5;
                for (let i = 0; i < 5; i++) {
                    const gridY = y + (height / 5) * i;
                    ctx.beginPath();
                    ctx.moveTo(x, gridY);
                    ctx.lineTo(x + width, gridY);
                    ctx.stroke();
                }

                // Vertical grid
                for (let i = 0; i < 10; i++) {
                    const gridX = x + (width / 10) * i;
                    ctx.beginPath();
                    ctx.moveTo(gridX, y);
                    ctx.lineTo(gridX, y + height);
                    ctx.stroke();
                }

                // Border glow
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Label with premium styling
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
                ctx.fillStyle = 'rgba(0, 255, 255, 1)';
                ctx.font = 'bold 9px monospace';
                ctx.fillText('❤ HEART RHYTHM', x + 8, y + 12);

                // BPM value display
                ctx.font = 'bold 11px monospace';
                ctx.fillStyle = hrColor;
                ctx.fillText(`${heartRateRef.current} BPM`, x + width - 60, y + 12);
                ctx.shadowBlur = 0;

                // Draw ECG waveform with multiple layers for depth
                if (pulseDataRef.current.length > 2) {
                    // Layer 1: Outer glow (widest)
                    ctx.strokeStyle = hrColor.replace('rgb', 'rgba').replace(')', ', 0.2)');
                    ctx.lineWidth = 8;
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = hrColor;
                    ctx.beginPath();
                    pulseDataRef.current.forEach((val, i) => {
                        const px = x + (i / pulseDataRef.current.length) * width;
                        const py = y + height / 2 - (val * height * 0.4);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    });
                    ctx.stroke();

                    // Layer 2: Middle glow
                    ctx.strokeStyle = hrColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    pulseDataRef.current.forEach((val, i) => {
                        const px = x + (i / pulseDataRef.current.length) * width;
                        const py = y + height / 2 - (val * height * 0.4);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    });
                    ctx.stroke();

                    // Layer 3: Core line (brightest)
                    ctx.strokeStyle = hrColor;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = hrColor;
                    ctx.beginPath();
                    pulseDataRef.current.forEach((val, i) => {
                        const px = x + (i / pulseDataRef.current.length) * width;
                        const py = y + height / 2 - (val * height * 0.4);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    });
                    ctx.stroke();

                    // Layer 4: White core for neon effect
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = '#ffffff';
                    ctx.beginPath();
                    pulseDataRef.current.forEach((val, i) => {
                        const px = x + (i / pulseDataRef.current.length) * width;
                        const py = y + height / 2 - (val * height * 0.4);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    });
                    ctx.stroke();

                    // Gradient fill under waveform
                    const gradient = ctx.createLinearGradient(x, y, x, y + height);
                    gradient.addColorStop(0, hrColor.replace('rgb', 'rgba').replace(')', ', 0.3)'));
                    gradient.addColorStop(1, hrColor.replace('rgb', 'rgba').replace(')', ', 0)'));

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(x, y + height);
                    pulseDataRef.current.forEach((val, i) => {
                        const px = x + (i / pulseDataRef.current.length) * width;
                        const py = y + height / 2 - (val * height * 0.4);
                        ctx.lineTo(px, py);
                    });
                    ctx.lineTo(x + width, y + height);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            };

            // Dynamic color based on heart rate zones
            let hrColor = 'rgb(34, 197, 94)'; // Rest (Green)
            if (heartRateRef.current > 140) hrColor = 'rgb(239, 68, 68)'; // Peak (Red)
            else if (heartRateRef.current > 100) hrColor = 'rgb(249, 115, 22)'; // Fat Burn (Orange)

            drawPremiumHeartRhythm();

            // 2. Stress Graph (Area Chart - Nadi Pariksha)
            // Using HRV-derived stress: 0 (Relaxed) to 100 (Tense)
            const stressVal = hrvDataRef.current[hrvDataRef.current.length - 1];
            const stressStatus = stressVal < 30 ? "Relaxed" : stressVal < 70 ? "Balanced" : "High";
            drawGraph(`STRESS (HRV): ${stressStatus}`, hrvDataRef.current.map(v => v / 100), graphX, startY + graphH + gap, graphW, graphH, 'rgb(168, 85, 247)', 'area');

            const pranaStatus = energyLevelRef.current > 0.6 ? "High" : "Building";
            drawGraph(`Prana: ${pranaStatus}`, pranaDataRef.current, graphX, startY + (graphH + gap) * 2, graphW, graphH, 'rgb(0, 215, 255)', 'fill');

            const focusStatus = focusScoreRef.current > 0.6 ? "Sharp" : "Drifting";
            drawGraph(`Focus: ${focusStatus}`, focusDataRef.current, graphX, startY + (graphH + gap) * 3, graphW, graphH, 'rgb(255, 200, 0)', 'beam');

            drawGraph(`HRV (RMSSD): ${hrvIndexRef.current} ms`, hrvIndexDataRef.current, graphX, startY + (graphH + gap) * 4, graphW, graphH, 'rgb(255, 255, 255)', 'area');

            // --- NADI PARIKSHA (Tiny Graphs) ---
            const tgY = startY + (graphH + gap) * 5 + 15;
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px sans-serif';
            ctx.fillText("Nadi Pariksha (Doshas):", graphX, tgY);

            const drawTinyBar = (label: string, data: number[], x: number, y: number, color: string) => {
                ctx.fillStyle = color;
                ctx.fillText(label, x, y);
                const barH = 10;
                const barW = 50; // Narrower bars
                const bx = x;
                const by = y + 4;

                // Draw bars
                const bw = barW / Math.max(1, data.length);
                data.forEach((val, i) => {
                    const h = val * barH;
                    ctx.fillRect(bx + i * bw, by + barH - h, bw - 1, h);
                });
            };

            // Spread out tiny graphs
            drawTinyBar("Vata", vataHistoryRef.current, graphX, tgY + 15, 'rgb(255, 200, 100)');
            drawTinyBar("Pitta", pittaHistoryRef.current, graphX + 90, tgY + 15, 'rgb(255, 0, 0)');
            drawTinyBar("Kapha", kaphaHistoryRef.current, graphX + 180, tgY + 15, 'rgb(0, 255, 0)');

            ctx.fillStyle = 'rgba(200, 255, 255, 1)';
            ctx.fillText(findingRef.current, graphX, tgY + 45);

            // --- ENERGY COHERENCE RADAR ---
            const guideY = tgY + 55;
            const coherenceY = guideY + 50;
            const coherenceX = panelW / 2;
            const radius = 15 + energyLevelRef.current * 25; // Smaller radius

            // Radar Background
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.arc(coherenceX, coherenceY, 40, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(coherenceX - 40, coherenceY); ctx.lineTo(coherenceX + 40, coherenceY); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(coherenceX, coherenceY - 40); ctx.lineTo(coherenceX, coherenceY + 40); ctx.stroke();

            // Dynamic Blob
            ctx.beginPath();
            for (let i = 0; i < 36; i++) {
                const angle = (i * 10 * Math.PI) / 180;
                const pulse = 1.0 + 0.05 * Math.sin(phaseRef.current * 4 + i * 0.5);
                const r = radius * pulse;
                const px = coherenceX + r * Math.cos(angle);
                const py = coherenceY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            let cohColor = 'rgba(0, 215, 255, 0.5)'; // Gold
            if (energyLevelRef.current < 0.3) cohColor = 'rgba(0, 0, 255, 0.5)';
            else if (energyLevelRef.current > 0.7) cohColor = 'rgba(255, 0, 255, 0.5)';

            ctx.fillStyle = cohColor;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#cccccc';
            ctx.fillText(`Energy Coherence: ${Math.round(energyLevelRef.current * 100)}%`, coherenceX - 50, coherenceY + 55);

            // --- DATA ANALYSIS BOT ---
            const botY = coherenceY + radius + 40;
            const botX = 50; // Fixed left position

            // Update Bot State
            const t = Date.now() / 1000;
            botBlinkTimerRef.current = t % 3.0;
            const isBlink = botBlinkTimerRef.current > 2.85;

            botLookCycleRef.current = t % 8.0;
            let eyeDx = 0;
            if (botLookCycleRef.current > 2.0 && botLookCycleRef.current < 3.5) eyeDx = -4;
            else if (botLookCycleRef.current > 5.0 && botLookCycleRef.current < 6.5) eyeDx = 4;

            // Draw Head
            ctx.fillStyle = '#323232';
            ctx.beginPath(); ctx.arc(botX, botY, 20, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Eyes
            if (isBlink) {
                ctx.beginPath(); ctx.moveTo(botX - 10, botY - 3); ctx.lineTo(botX - 3, botY - 3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(botX + 3, botY - 3); ctx.lineTo(botX + 10, botY - 3); ctx.stroke();
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(botX - 6, botY - 3, 5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(botX + 6, botY - 3, 5, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#000000';
                ctx.beginPath(); ctx.arc(botX - 6 + eyeDx, botY - 3, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(botX + 6 + eyeDx, botY - 3, 2, 0, Math.PI * 2); ctx.fill();
            }

            // Smile
            ctx.beginPath();
            ctx.ellipse(botX, botY + 4, 9, 5, 0, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();

            // Typing Text
            if (insightTextRef.current !== lastInsightTextRef.current) {
                typingCharCountRef.current = 0;
                lastInsightTextRef.current = insightTextRef.current;
            }

            if (typingCharCountRef.current < insightTextRef.current.length) {
                typingCharCountRef.current += 0.5; // Typing speed
            }

            const currentText = insightTextRef.current.substring(0, Math.floor(typingCharCountRef.current));

            // Text Bubble
            ctx.font = '12px sans-serif';
            const textMetrics = ctx.measureText(currentText);
            const tw = textMetrics.width;
            const bx = botX - tw / 2; // Center above bot
            const by = botY - 35;

            // Clamp to canvas
            const finalBx = Math.max(10, Math.min(w - tw - 10, bx));

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(finalBx - 5, by - 12, tw + 10, 16);
            ctx.strokeStyle = '#00ffff';
            ctx.strokeRect(finalBx - 5, by - 12, tw + 10, 16);

            ctx.fillStyle = '#ffffff';
            ctx.fillText(currentText, finalBx, by);

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, []); // Empty dependency array for stable loop

    return (
        <div
            onMouseMove={handleMouseMove}
            className="relative w-full h-full bg-black/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,215,255,0.05)] transition-all duration-300 pointer-events-auto"
        >
            {/* Header */}
            <div className="absolute top-3 left-0 w-full text-center z-10">
                <h3 className="text-[#00ffff] font-sans text-[10px] font-black tracking-[0.2em] opacity-80 uppercase">
                    Neural Analytics
                </h3>
                {/* Live Sensor Indicator */}
                {heartRate > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-[8px] text-green-400 font-bold tracking-wider">LIVE SENSOR ACTIVE</span>
                    </div>
                )}
            </div>

            {/* Numeric Stats */}
            <div className="absolute top-10 left-4 right-4 flex items-center justify-between z-10 bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                    {/* Heart Icon */}
                    <div className={`text-xl ${beatDetected ? 'text-red-500 scale-125' : 'text-red-900'} transition-all duration-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]`}>
                        ♥
                    </div>
                    <div>
                        <div className="text-xl font-black text-white font-mono leading-none">{heartRate}</div>
                        <div className="text-[8px] text-cyan-400 font-bold tracking-widest uppercase">BPM</div>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10"></div>

                <div className="text-right">
                    <div className="text-base font-black text-blue-400 font-mono leading-none">O₂: {spo2}%</div>
                    <div className="text-[8px] text-blue-300/60 font-bold tracking-widest uppercase">Saturation</div>
                </div>
            </div>

            {/* Canvas Layer */}
            <canvas
                ref={canvasRef}
                width={300}
                height={600}
                className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-90"
            />

            {/* Connection Status Indicator */}
            <div className="absolute top-3 right-4 z-20">
                <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                    <span className="text-[7px] text-white/40 font-black tracking-widest uppercase">{isConnected ? 'Link: OK' : 'No Link'}</span>
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${isConnected ? 'bg-green-500 text-green-500 animate-pulse' : 'bg-red-500 text-red-500'}`}></div>
                </div>
            </div>

            {/* Reconnect Call to Action Overlay */}
            {!isConnected && onConnect && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-500">
                    <button
                        onClick={onConnect}
                        className="group relative px-6 py-2 bg-cyan-500/10 border border-cyan-500/50 rounded-full overflow-hidden transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95"
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            <span className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em]">Connect Bio-Sensor</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                        </div>
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform"></div>
                    </button>
                </div>
            )}
        </div>
    );
}
