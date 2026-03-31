/**
 * useAICoach Hook
 * 
 * React hook for fetching AI guidance from the Gemini API
 * Handles loading states, errors, and response caching
 */

import { useState, useCallback, useRef } from 'react';
import { getAIGuidance, type AIContext, type AIResponse } from '../utils/ai-coach';

export function useAICoach() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);

    // Debounce ref to prevent rapid-fire requests
    const lastRequestTime = useRef(0);
    const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

    /**
     * Get AI guidance for the given context
     */
    const getGuidance = useCallback(async (context: AIContext): Promise<AIResponse | null> => {
        const now = Date.now();

        // Debounce check
        if (now - lastRequestTime.current < MIN_REQUEST_INTERVAL) {
            console.log('[AI Coach] Request debounced');
            return null;
        }

        lastRequestTime.current = now;
        setIsLoading(true);
        setError(null);

        try {
            const response = await getAIGuidance(context);
            setLastResponse(response);
            setIsLoading(false);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setIsLoading(false);
            console.error('[AI Coach] Error:', err);
            return null;
        }
    }, []);

    /**
     * Clear the last response
     */
    const clearResponse = useCallback(() => {
        setLastResponse(null);
        setError(null);
    }, []);

    return {
        getGuidance,
        clearResponse,
        isLoading,
        error,
        lastResponse
    };
}
