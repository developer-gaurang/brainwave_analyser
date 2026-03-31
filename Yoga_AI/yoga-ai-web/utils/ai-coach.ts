/**
 * AI Coach - Gemini API Integration
 * 
 * Handles communication with Google Gemini API to generate
 * context-aware, personalized yoga guidance.
 * 
 * TypeScript port of ai_explainer.py
 */

import { getMudraWisdom } from './mudra-wisdom';
import type { SessionPhase } from './yoga-agent';

export interface AIContext {
    mudra?: string;
    pose?: string;
    heartRate?: number;
    stressLevel?: number;
    energyLevel?: number;
    sessionPhase?: SessionPhase;
    isMeditating?: boolean;
}

export interface AIResponse {
    guidance: string;
    source: "gemini" | "fallback";
    cached?: boolean;
}

// Simple cache to prevent redundant API calls
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

/**
 * Get AI guidance from Gemini API
 */
export async function getAIGuidance(context: AIContext): Promise<AIResponse> {
    // Check cache first
    const cacheKey = generateCacheKey(context);
    const cached = responseCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return {
            guidance: cached.response,
            source: "gemini",
            cached: true
        };
    }

    try {
        // Call Next.js API route (keeps API key secure on server)
        const response = await fetch('/api/ai-guidance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(context),
        });

        if (!response.ok) {
            console.warn('[AI Coach] API call failed, using fallback');
            return getFallbackGuidance(context);
        }

        const data = await response.json();

        // Cache the response
        responseCache.set(cacheKey, {
            response: data.guidance,
            timestamp: Date.now()
        });

        return {
            guidance: data.guidance,
            source: "gemini",
            cached: false
        };
    } catch (error) {
        console.error('[AI Coach] Error:', error);
        return getFallbackGuidance(context);
    }
}

/**
 * Generate cache key from context
 */
function generateCacheKey(context: AIContext): string {
    return `${context.mudra || 'none'}_${context.sessionPhase || 'none'}_${context.isMeditating ? 'med' : 'active'}`;
}

/**
 * Get fallback guidance when API is unavailable
 */
function getFallbackGuidance(context: AIContext): AIResponse {
    let guidance = "Focus on your breath and find your center.";

    if (context.mudra) {
        const wisdom = getMudraWisdom(context.mudra);
        if (wisdom) {
            guidance = `${wisdom.sanskrit}: ${wisdom.meaning}. ${wisdom.benefits[0]}.`;
        }
    } else if (context.isMeditating) {
        guidance = "Deep meditation brings clarity. Stay present with each breath.";
    } else if (context.stressLevel && context.stressLevel > 70) {
        guidance = "Release tension with each exhale. Let your shoulders drop naturally.";
    } else if (context.energyLevel && context.energyLevel > 80) {
        guidance = "Your energy is flowing beautifully. Maintain this harmonious state.";
    }

    return {
        guidance,
        source: "fallback"
    };
}

/**
 * Build context-aware prompt for Gemini
 * This is used by the API route
 */
export function buildGeminiPrompt(context: AIContext): string {
    const wisdom = context.mudra ? getMudraWisdom(context.mudra) : null;

    let prompt = `You are a wise, empathetic Yoga Guru and AI Coach. You provide short, spoken guidance to practitioners in real-time.

Current Context:
- Session Phase: ${context.sessionPhase || 'WARMUP'}
- Pose/Mudra: ${context.mudra || context.pose || 'None detected'}
- Meditation State: ${context.isMeditating ? 'Deep meditation' : 'Active practice'}`;

    if (context.heartRate) {
        prompt += `\n- Heart Rate: ${context.heartRate} BPM`;
    }

    if (context.energyLevel) {
        prompt += `\n- Energy Level: ${context.energyLevel}%`;
    }

    if (wisdom) {
        prompt += `\n\nScriptural Reference:
- Sanskrit: ${wisdom.sanskrit}
- Element: ${wisdom.element}
- Chakra: ${wisdom.chakra}
- Meaning: ${wisdom.meaning}
- Scripture: ${wisdom.scripture}`;
    }

    prompt += `\n\nTask:
Provide a short, 1-2 sentence spoken guidance. `;

    if (context.stressLevel && context.stressLevel > 70) {
        prompt += `The practitioner's stress is elevated. Provide calming, reassuring guidance.`;
    } else if (context.isMeditating) {
        prompt += `Encourage their deep meditation practice with wisdom.`;
    } else if (wisdom) {
        prompt += `Explain the spiritual significance of this mudra in a poetic, inspiring way.`;
    } else {
        prompt += `Provide general encouragement and alignment tips.`;
    }

    prompt += `\n\nTone: Calm, warm, Indian wisdom tradition. Use English with occasional Sanskrit terms.
Output: Just the spoken text, no labels or formatting.`;

    return prompt;
}
