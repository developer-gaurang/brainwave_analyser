"use client";

// Real-time Signal Processing Worker for Brain-Wave Analysis
// Handles Notch filtering (50/60Hz) and Band-wise Power Calculation (FFT)

let buffer: number[] = [];
const SAMPLE_RATE = 500; // Hz
const WINDOW_SIZE = 512; // Must be power of 2 for FFT
const OVERLAP = 256;

self.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === "DATA_CHUNK") {
        // Process incoming raw data (uV)
        buffer.push(...data);

        if (buffer.length >= WINDOW_SIZE) {
            const window = buffer.slice(0, WINDOW_SIZE);
            const processed = processSignal(window);
            self.postMessage({ type: "BANDS", data: processed });
            buffer = buffer.slice(OVERLAP); // Sliding window
        }
    }
};

function processSignal(data: number[]) {
    // 1. Simple Notch Filter Mock / Placeholder
    // (In a full migration, we use SOS coefficients here)
    const filtered = data.map(v => v); // Placeholder

    // 2. Perform FFT (Simplified Radix-2 or Discrete Fourier)
    // For the "Ditto" version, we'll implement a fast FFT here.
    const power = calculatePower(filtered);

    return {
        alpha: power.alpha,
        beta: power.beta,
        theta: power.theta,
        delta: power.delta,
        gamma: power.gamma,
        total: power.total
    };
}

function calculatePower(data: number[]) {
    // Placeholder calculations to mimic brainwaveanalyzer.py
    // In next steps, we'll replace this with real FFT results.
    const avg = data.reduce((a, b) => a + Math.abs(b), 0) / data.length;
    return {
        alpha: avg * 0.25,
        beta: avg * 0.35,
        theta: avg * 0.15,
        delta: avg * 0.1,
        gamma: avg * 0.15,
        total: avg
    };
}
