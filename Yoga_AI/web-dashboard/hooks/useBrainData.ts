"use client";

import { useState, useEffect, useRef } from 'react';

export interface BrainData {
    timestamp: number;
    waveform: number[];
    bands: {
        delta: number;
        theta: number;
        alpha: number;
        beta: number;
        gamma: number;
    };
    metrics: {
        relaxation_score: number;
        pump_active: boolean;
        bpm: number | string;
        activations: number;
    };
}

export function useBrainData() {
    const [data, setData] = useState<BrainData | null>(null);
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket('ws://localhost:8080');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to BrainWave Bridge');
                setConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    setData(parsed);
                } catch (e) {
                    console.error('Parse error', e);
                }
            };

            ws.onclose = () => {
                setConnected(false);
                // Reconnect after 2s
                setTimeout(connect, 2000);
            };

            ws.onerror = (err) => {
                console.error('WebSocket Error', err);
                ws.close();
            };
        };

        connect();

        return () => {
            wsRef.current?.close();
        };
    }, []);

    return { data, connected };
}
