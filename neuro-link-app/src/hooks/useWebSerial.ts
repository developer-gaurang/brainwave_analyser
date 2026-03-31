"use client";

import { useState, useCallback, useRef } from "react";

export function useWebSerial() {
    const [port, setPort] = useState<any>(null);
    const [reading, setReading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const readerRef = useRef<any>(null);

    const connect = useCallback(async (baudRate = 230400) => {
        try {
            if (!("serial" in navigator)) {
                throw new Error("Web Serial API not supported in this browser.");
            }

            // @ts-ignore
            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate });
            setPort(selectedPort);
            setError(null);
            return selectedPort;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (readerRef.current) {
            await readerRef.current.cancel();
        }
        if (port) {
            await port.close();
            setPort(null);
        }
        setReading(false);
    }, [port]);

    const startReading = useCallback(async (onData: (chunk: Uint8Array) => void) => {
        if (!port) return;

        try {
            setReading(true);
            while (port.readable && reading) {
                readerRef.current = port.readable.getReader();
                try {
                    while (true) {
                        const { value, done } = await readerRef.current.read();
                        if (done) break;
                        if (value) onData(value);
                    }
                } finally {
                    readerRef.current.releaseLock();
                }
            }
        } catch (err: any) {
            setError(err.message);
            setReading(false);
        }
    }, [port, reading]);

    return { connect, disconnect, startReading, port, reading, error };
}
