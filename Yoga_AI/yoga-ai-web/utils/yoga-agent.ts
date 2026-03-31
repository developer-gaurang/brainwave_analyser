/**
 * Yoga Agent - The "Brain" of the Yoga AI System
 * 
 * This agent maintains session state, tracks user progress, and decides
 * when to provide guidance based on context-aware reasoning.
 * 
 * TypeScript port of the Python agent.py
 */

import { getMudraWisdom } from './mudra-wisdom';

export type SessionPhase = "WARMUP" | "FLOW" | "MEDITATION" | "COOLDOWN";

export interface AgentState {
    currentPose: string | null;
    currentMudra: string | null;
    streakCount: number;
    energyLevel: number; // 0-100
    stressHistory: number[];
    lastGuidanceTime: number;
    isMeditating: boolean;
    heartRate: number | null;
    sessionStartTime: number;
}

export interface GuidanceAction {
    action: "guide_stress" | "teach_philosophy" | "encourage" | "correct_posture" | "celebrate";
    text: string;
    metadata: {
        source: "agent" | "gemini" | "biofeedback";
        mudra?: string;
        phase?: SessionPhase;
    };
}

export class YogaAgent {
    private state: AgentState;
    private phase: SessionPhase;
    private readonly GUIDANCE_COOLDOWN = 10000; // 10 seconds
    private readonly STRESS_THRESHOLD = 70;
    private readonly HIGH_HR_THRESHOLD = 100; // BPM
    private readonly MEDITATION_DURATION_THRESHOLD = 30000; // 30 seconds for phase transition

    constructor() {
        this.state = {
            currentPose: null,
            currentMudra: null,
            streakCount: 0,
            energyLevel: 50,
            stressHistory: [],
            lastGuidanceTime: 0,
            isMeditating: false,
            heartRate: null,
            sessionStartTime: Date.now()
        };
        this.phase = "WARMUP";
    }

    /**
     * Update internal state with new sensor/vision data
     */
    updateState(data: {
        pose?: string | null;
        mudra?: string | null;
        heartRate?: number | null;
        isMeditating?: boolean;
        energyLevel?: number;
    }): void {
        if (data.pose !== undefined) {
            this.state.currentPose = data.pose;
        }

        if (data.mudra !== undefined) {
            this.state.currentMudra = data.mudra;
        }

        if (data.heartRate !== undefined && data.heartRate !== null) {
            this.state.heartRate = data.heartRate;

            // Calculate stress index based on heart rate
            const stressIndex = this.calculateStressIndex(data.heartRate);
            this.state.stressHistory.push(stressIndex);

            // Keep only last 20 readings
            if (this.state.stressHistory.length > 20) {
                this.state.stressHistory.shift();
            }
        }

        if (data.isMeditating !== undefined) {
            this.state.isMeditating = data.isMeditating;
        }

        if (data.energyLevel !== undefined) {
            this.state.energyLevel = data.energyLevel;
        }

        // Update session phase based on state
        this.updatePhase();
    }

    /**
     * Calculate stress index from heart rate
     */
    private calculateStressIndex(heartRate: number): number {
        // Simple stress calculation: normalize HR to 0-100 scale
        // Assuming resting HR ~60, max HR ~180
        const normalized = Math.max(0, Math.min(100, ((heartRate - 60) / 120) * 100));
        return normalized;
    }

    /**
     * Update session phase based on current state
     */
    private updatePhase(): void {
        const sessionDuration = Date.now() - this.state.sessionStartTime;

        // Phase transitions
        if (this.state.isMeditating && sessionDuration > this.MEDITATION_DURATION_THRESHOLD) {
            this.phase = "MEDITATION";
        } else if (this.state.currentMudra && sessionDuration > 60000) { // 1 minute
            this.phase = "FLOW";
        } else if (sessionDuration > 300000) { // 5 minutes
            this.phase = "COOLDOWN";
        }
    }

    /**
     * Decide what action to take based on current state
     * This is the core "reasoning" engine
     */
    decideAction(): GuidanceAction | null {
        const now = Date.now();

        // Cooldown check - prevent guidance spam
        if (now - this.state.lastGuidanceTime < this.GUIDANCE_COOLDOWN) {
            return null;
        }

        // Priority 1: High Stress Detection
        const avgStress = this.getAverageStress();
        if (avgStress > this.STRESS_THRESHOLD || (this.state.heartRate && this.state.heartRate > this.HIGH_HR_THRESHOLD)) {
            this.state.lastGuidanceTime = now;
            return {
                action: "guide_stress",
                text: "I notice your pulse is elevating. Release any tension in your jaw and shoulders. Focus on a slow, steady exhale through your nose.",
                metadata: {
                    source: "biofeedback",
                    phase: this.phase
                }
            };
        }

        // Priority 2: Meditation Encouragement
        if (this.state.isMeditating && this.phase === "MEDITATION") {
            this.state.lastGuidanceTime = now;
            return {
                action: "encourage",
                text: "Deep meditation detected. Your energy is rising beautifully. Stay present with your breath.",
                metadata: {
                    source: "agent",
                    phase: this.phase
                }
            };
        }

        // Priority 3: Mudra Philosophy (requires Gemini API)
        if (this.state.currentMudra) {
            const wisdom = getMudraWisdom(this.state.currentMudra);
            if (wisdom) {
                this.state.lastGuidanceTime = now;

                // Return a signal that Gemini should be called
                // The actual API call will be made by the hook
                return {
                    action: "teach_philosophy",
                    text: "", // Will be filled by Gemini
                    metadata: {
                        source: "gemini",
                        mudra: this.state.currentMudra,
                        phase: this.phase
                    }
                };
            }
        }

        // Priority 4: General Encouragement
        if (this.state.energyLevel > 80 && this.state.currentPose) {
            this.state.lastGuidanceTime = now;
            return {
                action: "celebrate",
                text: "Excellent! Your chakras are harmonizing beautifully. Keep flowing with this energy.",
                metadata: {
                    source: "agent",
                    phase: this.phase
                }
            };
        }

        return null;
    }

    /**
     * Get average stress from history
     */
    private getAverageStress(): number {
        if (this.state.stressHistory.length === 0) return 0;
        const sum = this.state.stressHistory.reduce((a, b) => a + b, 0);
        return sum / this.state.stressHistory.length;
    }

    /**
     * Get current session phase
     */
    getSessionPhase(): SessionPhase {
        return this.phase;
    }

    /**
     * Get current agent state (for debugging/UI)
     */
    getState(): Readonly<AgentState> {
        return { ...this.state };
    }

    /**
     * Get session duration in seconds
     */
    getSessionDuration(): number {
        return Math.floor((Date.now() - this.state.sessionStartTime) / 1000);
    }

    /**
     * Reset agent state (for new session)
     */
    reset(): void {
        this.state = {
            currentPose: null,
            currentMudra: null,
            streakCount: 0,
            energyLevel: 50,
            stressHistory: [],
            lastGuidanceTime: 0,
            isMeditating: false,
            heartRate: null,
            sessionStartTime: Date.now()
        };
        this.phase = "WARMUP";
    }
}
