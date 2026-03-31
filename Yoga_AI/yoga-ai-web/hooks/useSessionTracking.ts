/**
 * useSessionTracking Hook
 * 
 * Track and save yoga sessions to Firestore
 */

"use client";

import { useState, useRef, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { saveSession, type YogaSession } from '../lib/firestore';
import type { SessionPhase } from '../utils/yoga-agent';

interface SessionData {
    mudrasPerformed: Set<string>;
    meditationStartTime: number | null;
    totalMeditationTime: number;
    heartRates: number[];
    maxEnergy: number;
    aiGuidanceCount: number;
    currentPhase: SessionPhase;
}

export function useSessionTracking(userId: string | null) {
    const [isTracking, setIsTracking] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const sessionStartTime = useRef<number>(0);
    const sessionData = useRef<SessionData>({
        mudrasPerformed: new Set(),
        meditationStartTime: null,
        totalMeditationTime: 0,
        heartRates: [],
        maxEnergy: 0,
        aiGuidanceCount: 0,
        currentPhase: 'WARMUP',
    });

    /**
     * Start tracking a new session
     */
    const startSession = useCallback(() => {
        if (!userId) return;

        sessionStartTime.current = Date.now();
        sessionData.current = {
            mudrasPerformed: new Set(),
            meditationStartTime: null,
            totalMeditationTime: 0,
            heartRates: [],
            maxEnergy: 0,
            aiGuidanceCount: 0,
            currentPhase: 'WARMUP',
        };
        setIsTracking(true);
    }, [userId]);

    /**
     * Update session data
     */
    const updateSession = useCallback((updates: {
        mudra?: string;
        isMeditating?: boolean;
        heartRate?: number;
        energyLevel?: number;
        aiGuidance?: boolean;
        phase?: SessionPhase;
    }) => {
        if (!isTracking) return;

        const data = sessionData.current;

        if (updates.mudra) {
            data.mudrasPerformed.add(updates.mudra);
        }

        if (updates.isMeditating !== undefined) {
            if (updates.isMeditating && !data.meditationStartTime) {
                data.meditationStartTime = Date.now();
            } else if (!updates.isMeditating && data.meditationStartTime) {
                data.totalMeditationTime += Date.now() - data.meditationStartTime;
                data.meditationStartTime = null;
            }
        }

        if (updates.heartRate !== undefined && updates.heartRate > 0) {
            data.heartRates.push(updates.heartRate);
        }

        if (updates.energyLevel !== undefined) {
            data.maxEnergy = Math.max(data.maxEnergy, updates.energyLevel);
        }

        if (updates.aiGuidance) {
            data.aiGuidanceCount++;
        }

        if (updates.phase) {
            data.currentPhase = updates.phase;
        }
    }, [isTracking]);

    /**
     * End session and save to Firestore
     */
    const endSession = useCallback(async (): Promise<string | null> => {
        if (!isTracking || !userId) return null;

        const endTime = Date.now();
        const duration = Math.floor((endTime - sessionStartTime.current) / 1000);
        const data = sessionData.current;

        // Calculate final meditation time
        if (data.meditationStartTime) {
            data.totalMeditationTime += endTime - data.meditationStartTime;
        }

        // Calculate average heart rate
        const avgHeartRate = data.heartRates.length > 0
            ? Math.round(data.heartRates.reduce((a, b) => a + b, 0) / data.heartRates.length)
            : undefined;

        const session: YogaSession = {
            userId,
            startTime: Timestamp.fromMillis(sessionStartTime.current),
            endTime: Timestamp.fromMillis(endTime),
            duration,
            mudrasPerformed: Array.from(data.mudrasPerformed),
            meditationTime: Math.floor(data.totalMeditationTime / 1000),
            avgHeartRate,
            maxEnergy: Math.round(data.maxEnergy),
            aiGuidanceCount: data.aiGuidanceCount,
            phase: data.currentPhase,
        };

        try {
            const id = await saveSession(session);
            setSessionId(id);
            setIsTracking(false);
            return id;
        } catch (error) {
            console.error('Failed to save session:', error);
            return null;
        }
    }, [isTracking, userId]);

    /**
     * Get current session stats
     */
    const getSessionStats = useCallback(() => {
        if (!isTracking) return null;

        const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        const data = sessionData.current;

        return {
            duration,
            mudrasCount: data.mudrasPerformed.size,
            meditationTime: Math.floor(data.totalMeditationTime / 1000),
            maxEnergy: Math.round(data.maxEnergy),
            aiGuidanceCount: data.aiGuidanceCount,
        };
    }, [isTracking]);

    return {
        isTracking,
        sessionId,
        startSession,
        updateSession,
        endSession,
        getSessionStats,
    };
}
