/**
 * AI Guidance API Route
 * 
 * Server-side endpoint for calling Gemini API
 * Keeps API key secure and prevents client-side exposure
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildGeminiPrompt, type AIContext } from '../../../utils/ai-coach';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function POST(request: NextRequest) {
    try {
        const context: AIContext = await request.json();

        // Get API key from environment
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn('[API] No GEMINI_API_KEY found in environment');
            return NextResponse.json(
                {
                    guidance: "Focus on your breath and find your center.",
                    source: "fallback",
                    error: "API key not configured"
                },
                { status: 200 } // Still return 200 to allow fallback
            );
        }

        // Build context-aware prompt
        const prompt = buildGeminiPrompt(context);

        // Call Gemini API
        const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150,
                    topP: 0.8,
                    topK: 40
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[API] Gemini API error:', response.status, errorText);

            return NextResponse.json(
                {
                    guidance: getFallbackMessage(context),
                    source: "fallback",
                    error: `API error: ${response.status}`
                },
                { status: 200 }
            );
        }

        const data = await response.json();
        const candidates = data.candidates || [];

        if (candidates.length === 0 || !candidates[0].content?.parts?.[0]?.text) {
            console.warn('[API] No valid response from Gemini');
            return NextResponse.json(
                {
                    guidance: getFallbackMessage(context),
                    source: "fallback"
                },
                { status: 200 }
            );
        }

        const guidance = candidates[0].content.parts[0].text.trim();

        return NextResponse.json({
            guidance,
            source: "gemini"
        });

    } catch (error) {
        console.error('[API] Exception:', error);

        return NextResponse.json(
            {
                guidance: "Focus on your breath and maintain your practice.",
                source: "fallback",
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 200 }
        );
    }
}

/**
 * Simple fallback message based on context
 */
function getFallbackMessage(context: AIContext): string {
    if (context.isMeditating) {
        return "Deep meditation brings clarity. Stay present with each breath.";
    }
    if (context.mudra) {
        return `${context.mudra} Mudra: Channel your energy with intention and focus.`;
    }
    return "Focus on your breath and find your center.";
}
