import { useState, useRef, useCallback, useEffect } from 'react';

export interface ArduinoData {
    heartRate: number;
    spo2: number;
    beatDetected: boolean;
    isConnected: boolean;
    hrvIndex: number;
    doshas: {
        vata: number;
        pitta: number;
        kapha: number;
    };
    insightText: string;
    finding: string;
}

export function useArduino() {
    const [data, setData] = useState<ArduinoData>({
        heartRate: 0,
        spo2: 0,
        beatDetected: false,
        isConnected: false,
        hrvIndex: 50,
        doshas: { vata: 0.33, pitta: 0.33, kapha: 0.33 },
        insightText: "Scanning bio-rhythms...",
        finding: "Scanning..."
    });

    const [error, setError] = useState<string | null>(null);
    const [demoMode, setDemoMode] = useState(false); // NEW: Demo mode toggle
    const portRef = useRef<SerialPort | null>(null);
    const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
    const isReadingRef = useRef(false);
    const lastBeatTimeRef = useRef<number>(0);
    const lastDataTimeRef = useRef<number>(0);
    const ibiHistoryRef = useRef<number[]>([]);
    const lastInsightTimeRef = useRef<number>(0);
    const lastHeartRateRef = useRef<number>(0);

    // NEW: Demo Data Simulation
    useEffect(() => {
        if (!demoMode) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const t = now / 1000;

            // Simulate realistic heart rate (65-85 BPM with breathing variation)
            const baseHR = 75;
            const breathVariation = Math.sin(t * 0.3) * 5; // Breathing cycle
            const randomNoise = (Math.random() - 0.5) * 2;
            const simulatedHR = Math.round(baseHR + breathVariation + randomNoise);

            // Simulate SpO2 (97-99%)
            const simulatedSpO2 = Math.round(98 + Math.sin(t * 0.5) * 1);

            // Simulate beat detection (periodic based on HR)
            const beatInterval = 60000 / simulatedHR;
            const shouldBeat = now - lastBeatTimeRef.current > beatInterval;
            if (shouldBeat) {
                lastBeatTimeRef.current = now;
            }

            // Simulate HRV (30-70 ms)
            const simulatedHRV = Math.round(50 + Math.sin(t * 0.2) * 20);

            // Simulate Doshas (slowly changing)
            const vata = 0.3 + Math.sin(t * 0.1) * 0.15;
            const pitta = 0.35 + Math.cos(t * 0.15) * 0.1;
            const kapha = 1 - vata - pitta;

            // Rotate insights
            const insights = [
                { text: "Breathing is syncing with heart rate.", finding: "Tridosha Balanced" },
                { text: "Deep state of relaxation detected.", finding: "Dominant: Kapha (Stability)" },
                { text: "Heart rhythm is steady and calm.", finding: "Tridosha Balanced" },
                { text: "Excellent physiological coherence.", finding: "Dominant: Vata (High Movement)" }
            ];
            const insightIndex = Math.floor(t / 15) % insights.length;

            setData({
                heartRate: simulatedHR,
                spo2: simulatedSpO2,
                beatDetected: shouldBeat,
                isConnected: true,
                hrvIndex: simulatedHRV,
                doshas: { vata, pitta, kapha },
                insightText: insights[insightIndex].text,
                finding: insights[insightIndex].finding
            });
        }, 100); // Update 10 times per second

        return () => clearInterval(interval);
    }, [demoMode]);

    // Data Timeout & Reset Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (data.isConnected && Date.now() - lastDataTimeRef.current > 3000) {
                // No data for 3 seconds, reset
                setData(prev => {
                    if (prev.heartRate === 0 && prev.spo2 === 0) return prev; // Already reset
                    return { ...prev, heartRate: 0, spo2: 0, beatDetected: false, hrvIndex: 0 };
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [data.isConnected]);

    const calculateDoshas = (ibis: number[]) => {
        if (ibis.length < 5) return { vata: 0.33, pitta: 0.33, kapha: 0.33 };

        // Simple simulation based on HRV characteristics
        // Vata: High variability (Irregular)
        // Pitta: Moderate variability (Strong/Fast)
        // Kapha: Low variability (Slow/Steady)

        let rmssd = 0;
        for (let i = 0; i < ibis.length - 1; i++) {
            rmssd += Math.pow(ibis[i + 1] - ibis[i], 2);
        }
        rmssd = Math.sqrt(rmssd / (ibis.length - 1));

        const avgIbi = ibis.reduce((a, b) => a + b, 0) / ibis.length;
        const bpm = 60000 / avgIbi;

        let v = 0.3, p = 0.3, k = 0.3;

        // Vata (Anxiety/Movement) -> High RMSSD, Irregular
        if (rmssd > 50) v += 0.4;

        // Pitta (Heat/Energy) -> High BPM, Moderate RMSSD
        if (bpm > 80) p += 0.4;

        // Kapha (Stability) -> Low BPM, Low RMSSD
        if (bpm < 65 && rmssd < 30) k += 0.4;

        // Normalize
        const total = v + p + k;
        return { vata: v / total, pitta: p / total, kapha: k / total };
    };

    const generateInsight = (hr: number, hrv: number, doshas: { vata: number, pitta: number, kapha: number }) => {
        const now = Date.now();
        if (now - lastInsightTimeRef.current < 15000) return null; // Update every 15s
        lastInsightTimeRef.current = now;

        let insight = "Breathing is syncing with heart rate.";
        let finding = "Scanning...";

        // Finding Logic
        if (doshas.vata > 0.4) finding = "Dominant: Vata (High Movement)";
        else if (doshas.pitta > 0.4) finding = "Dominant: Pitta (High Energy)";
        else if (doshas.kapha > 0.4) finding = "Dominant: Kapha (Stability)";
        else finding = "Finding: Tridosha Balanced";

        // Insight Logic
        if (hr > 90) insight = "High arousal. Focus on slow exhalations.";
        else if (hr > 75) insight = "Slight tension. Soften your shoulders.";
        else if (hrv > 60) insight = "Deep state of relaxation detected.";
        else if (hrv > 40) insight = "Heart rhythm is steady and calm.";
        else insight = "Excellent physiological coherence.";

        return { insight, finding };
    };

    const hrBufferRef = useRef<number[]>([]);

    const parseLine = useCallback((line: string) => {
        // Expected formats: 
        // "BPM:75,SpO2:98" (original)
        // "HR:75;SpO2:98;" (alternative with semicolons)
        if (!line) return;

        // Handle both comma and semicolon separators
        const parts = line.split(/[,;]/).filter(p => p.trim());
        let newHr: number | null = null;
        let newSpo2: number | null = null;
        let newIbi: number | null = null;
        let beat = false;

        parts.forEach(part => {
            const [key, valStr] = part.split(':');
            if (!key || !valStr) return;

            const val = parseFloat(valStr);

            if (key.includes('BPM') || key.includes('HR')) {
                newHr = val;
            } else if (key.includes('SpO2') || key.includes('O2')) {
                newSpo2 = val;
            } else if (key.includes('IBI')) {
                newIbi = val;
            } else if (key.includes('BEAT')) {
                beat = val > 0;
            }
        });

        // Update if we got valid keys
        if (newHr !== null || newSpo2 !== null) {
            lastDataTimeRef.current = Date.now();
            const now = Date.now();

            if (newIbi && newIbi > 0) {
                ibiHistoryRef.current.push(newIbi);
                if (ibiHistoryRef.current.length > 30) ibiHistoryRef.current.shift();
                beat = true;
            } else if (newHr !== null && newHr > 0) {
                // SOFTWARE FALLBACK if hardware IBI is missing
                const beatInterval = 60000 / newHr;
                if (now - lastBeatTimeRef.current > beatInterval) {
                    beat = true;
                    // Calculate IBI from local time
                    const ibi = now - lastBeatTimeRef.current;
                    if (ibi > 300 && ibi < 1500) { // Valid IBI
                        ibiHistoryRef.current.push(ibi);
                        if (ibiHistoryRef.current.length > 20) ibiHistoryRef.current.shift();
                    }
                    lastBeatTimeRef.current = now;
                }
            }

            // Calculate Metrics
            let hrv = 50;
            let doshas = { vata: 0.33, pitta: 0.33, kapha: 0.33 };

            if (ibiHistoryRef.current.length > 5) {
                // RMSSD Calculation
                let sumSqDiff = 0;
                for (let i = 0; i < ibiHistoryRef.current.length - 1; i++) {
                    sumSqDiff += Math.pow(ibiHistoryRef.current[i + 1] - ibiHistoryRef.current[i], 2);
                }
                hrv = Math.sqrt(sumSqDiff / (ibiHistoryRef.current.length - 1));
                doshas = calculateDoshas(ibiHistoryRef.current);
            }

            // SMOOTHING LOGIC
            let smoothedHr = 0;
            if (newHr !== null) {
                if (newHr > 0) {
                    hrBufferRef.current.push(newHr);
                    if (hrBufferRef.current.length > 10) hrBufferRef.current.shift(); // Keep last 10 samples
                    smoothedHr = Math.round(hrBufferRef.current.reduce((a, b) => a + b, 0) / hrBufferRef.current.length);
                } else {
                    hrBufferRef.current = []; // Reset buffer on 0
                    smoothedHr = 0;
                }
            } else {
                smoothedHr = lastHeartRateRef.current; // Keep previous if no new HR
            }

            lastHeartRateRef.current = smoothedHr;

            // Use actual SpO2 from sensor (if available)
            let finalSpo2 = 0;
            if (newSpo2 !== null) {
                finalSpo2 = newSpo2;
            }


            // Generate Insight
            const newInsights = generateInsight(smoothedHr, hrv, doshas);

            setData(prev => ({
                ...prev,
                heartRate: smoothedHr,
                spo2: finalSpo2,
                beatDetected: beat,
                hrvIndex: Math.round(hrv),
                doshas: doshas,
                insightText: newInsights ? newInsights.insight : prev.insightText,
                finding: newInsights ? newInsights.finding : prev.finding
            }));

            if (beat) {
                setTimeout(() => setData(prev => ({ ...prev, beatDetected: false })), 100);
            }
        }
    }, []);

    const disconnect = useCallback(async () => {
        isReadingRef.current = false;
        if (readerRef.current) {
            await readerRef.current.cancel();
            readerRef.current = null;
        }
        if (portRef.current) {
            await portRef.current.close();
            portRef.current = null;
        }
        setData(prev => ({ ...prev, isConnected: false, heartRate: 0, spo2: 0 }));
    }, []);

    const readLoop = useCallback(async () => {
        let buffer = "";

        while (isReadingRef.current && readerRef.current) {
            try {
                const { value, done } = await readerRef.current.read();
                if (done) {
                    break;
                }
                if (value) {
                    buffer += value;
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ""; // Keep incomplete line

                    for (const line of lines) {
                        parseLine(line.trim());
                    }
                }
            } catch (err) {
                console.error("Read error:", err);
                setError("Connection lost");
                disconnect();
                break;
            }
        }
    }, [disconnect, parseLine]);

    const connect = useCallback(async () => {
        setError(null);
        if (!("serial" in navigator)) {
            setError("Web Serial API not supported. Enabling demo mode...");
            setDemoMode(true); // Enable demo mode as fallback
            return;
        }

        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 });
            portRef.current = port;

            setData(prev => ({ ...prev, isConnected: true }));
            setDemoMode(false); // Disable demo mode when real sensor connects

            const textDecoder = new TextDecoderStream();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const readableStreamClosed = port.readable!.pipeTo(textDecoder.writable as unknown as WritableStream<Uint8Array>);
            const reader = textDecoder.readable.getReader();
            readerRef.current = reader;
            isReadingRef.current = true;

            readLoop();
        } catch (err) {
            console.error("Error connecting to Arduino:", err);
            const msg = err instanceof Error ? err.message : String(err);

            // If user cancelled or no port selected, enable demo mode
            if (msg.includes("No port selected") || msg.includes("cancelled")) {
                setError("No sensor selected. Enabling demo mode...");
                setDemoMode(true);
            } else {
                setError(msg);
            }

            setData(prev => ({ ...prev, isConnected: false }));
        }
    }, [readLoop]);

    return {
        arduinoData: data,
        connectArduino: connect,
        disconnectArduino: disconnect,
        arduinoError: error,
        enableDemoMode: () => setDemoMode(true),
        disableDemoMode: () => setDemoMode(false),
        isDemoMode: demoMode
    };
}
