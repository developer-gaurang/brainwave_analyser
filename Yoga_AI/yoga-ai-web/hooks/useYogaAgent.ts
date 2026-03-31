/**
 * useYogaAgent Hook
 * 
 * React hook that manages the YogaAgent lifecycle and provides
 * methods to interact with the AI agent system
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { YogaAgent, type SessionPhase, type GuidanceAction } from '../utils/yoga-agent';

export function useYogaAgent() {
    const agentRef = useRef<YogaAgent | null>(null);
    const [sessionPhase, setSessionPhase] = useState<SessionPhase>("WARMUP");
    const [lastGuidance, setLastGuidance] = useState<GuidanceAction | null>(null);
    const [sessionDuration, setSessionDuration] = useState(0);

    // Initialize agent on mount
    useEffect(() => {
        agentRef.current = new YogaAgent();

        // Update session duration every second
        const interval = setInterval(() => {
            if (agentRef.current) {
                setSessionDuration(agentRef.current.getSessionDuration());
                setSessionPhase(agentRef.current.getSessionPhase());
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    /**
     * Update agent state with new data from vision/sensors
     */
    const updateAgentState = useCallback((data: {
        pose?: string | null;
        mudra?: string | null;
        heartRate?: number | null;
        isMeditating?: boolean;
        energyLevel?: number;
    }) => {
        if (agentRef.current) {
            agentRef.current.updateState(data);
        }
    }, []);

    /**
     * Request guidance from the agent
     * Returns null if agent decides not to provide guidance yet
     */
    const requestGuidance = useCallback((): GuidanceAction | null => {
        if (!agentRef.current) return null;

        const action = agentRef.current.decideAction();

        if (action) {
            setLastGuidance(action);
        }

        return action;
    }, []);

    /**
     * Get current agent state (for debugging/display)
     */
    const getAgentState = useCallback(() => {
        return agentRef.current?.getState() || null;
    }, []);

    /**
     * Reset agent (start new session)
     */
    const resetAgent = useCallback(() => {
        if (agentRef.current) {
            agentRef.current.reset();
            setSessionPhase("WARMUP");
            setLastGuidance(null);
            setSessionDuration(0);
        }
    }, []);

    return {
        updateAgentState,
        requestGuidance,
        getAgentState,
        resetAgent,
        sessionPhase,
        lastGuidance,
        sessionDuration
    };
}
