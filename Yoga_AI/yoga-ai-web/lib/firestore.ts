/**
 * Firestore Database Helpers
 * 
 * CRUD operations for user profiles, sessions, and progress tracking
 */

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    Timestamp,
    increment,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== TYPES ====================

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    photoURL?: string;
    createdAt: Timestamp;
    preferences: {
        favoriteMudras: string[];
        sessionGoal: number; // minutes
    };
    stats: {
        totalSessions: number;
        totalMinutes: number;
        currentStreak: number;
        bestStreak: number;
        lastSessionDate?: string; // YYYY-MM-DD
    };
}

export interface YogaSession {
    id?: string;
    userId: string;
    startTime: Timestamp;
    endTime: Timestamp;
    duration: number; // seconds
    mudrasPerformed: string[];
    meditationTime: number; // seconds
    avgHeartRate?: number;
    maxEnergy: number; // 0-100
    aiGuidanceCount: number;
    phase: 'WARMUP' | 'FLOW' | 'MEDITATION' | 'COOLDOWN';
}

// ==================== USER PROFILE ====================

/**
 * Create a new user profile
 */
export async function createUserProfile(
    uid: string,
    name: string,
    email: string,
    photoURL?: string
): Promise<void> {
    const userRef = doc(db, 'users', uid);

    const profile: UserProfile = {
        uid,
        name,
        email,
        photoURL,
        createdAt: Timestamp.now(),
        preferences: {
            favoriteMudras: [],
            sessionGoal: 15, // default 15 minutes
        },
        stats: {
            totalSessions: 0,
            totalMinutes: 0,
            currentStreak: 0,
            bestStreak: 0,
        },
    };

    await setDoc(userRef, profile);
}

/**
 * Get user profile
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    return null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
}

// ==================== SESSIONS ====================

/**
 * Save a yoga session
 */
export async function saveSession(session: YogaSession): Promise<string> {
    const sessionsRef = collection(db, 'sessions');
    const docRef = await addDoc(sessionsRef, session);

    // Update user stats
    await updateUserStats(session.userId, session);

    return docRef.id;
}

/**
 * Get user's recent sessions
 */
export async function getUserSessions(
    userId: string,
    limitCount: number = 10
): Promise<YogaSession[]> {
    const sessionsRef = collection(db, 'sessions');
    const q = query(
        sessionsRef,
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as YogaSession));
}

/**
 * Update user stats after session
 */
async function updateUserStats(userId: string, session: YogaSession): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userProfile = await getUserProfile(userId);

    if (!userProfile) return;

    const sessionDate = session.startTime.toDate().toISOString().split('T')[0];
    const lastSessionDate = userProfile.stats.lastSessionDate;

    // Calculate streak
    let currentStreak = userProfile.stats.currentStreak;
    if (lastSessionDate) {
        const daysDiff = getDaysDifference(lastSessionDate, sessionDate);
        if (daysDiff === 1) {
            currentStreak += 1; // Continue streak
        } else if (daysDiff > 1) {
            currentStreak = 1; // Reset streak
        }
        // If same day, keep current streak
    } else {
        currentStreak = 1; // First session
    }

    const bestStreak = Math.max(currentStreak, userProfile.stats.bestStreak);

    await updateDoc(userRef, {
        'stats.totalSessions': increment(1),
        'stats.totalMinutes': increment(Math.floor(session.duration / 60)),
        'stats.currentStreak': currentStreak,
        'stats.bestStreak': bestStreak,
        'stats.lastSessionDate': sessionDate,
    });
}

/**
 * Get days difference between two dates
 */
function getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ==================== PROGRESS ====================

/**
 * Get user's progress data for a date range
 */
export async function getUserProgress(
    userId: string,
    days: number = 30
): Promise<{ date: string; sessions: number; minutes: number; energy: number }[]> {
    const sessionsRef = collection(db, 'sessions');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
        sessionsRef,
        where('userId', '==', userId),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        orderBy('startTime', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => doc.data() as YogaSession);

    // Group by date
    const progressMap = new Map<string, { sessions: number; minutes: number; energySum: number; count: number }>();

    sessions.forEach(session => {
        const date = session.startTime.toDate().toISOString().split('T')[0];
        const existing = progressMap.get(date) || { sessions: 0, minutes: 0, energySum: 0, count: 0 };

        progressMap.set(date, {
            sessions: existing.sessions + 1,
            minutes: existing.minutes + Math.floor(session.duration / 60),
            energySum: existing.energySum + session.maxEnergy,
            count: existing.count + 1,
        });
    });

    // Convert to array
    return Array.from(progressMap.entries()).map(([date, data]) => ({
        date,
        sessions: data.sessions,
        minutes: data.minutes,
        energy: Math.round(data.energySum / data.count),
    }));
}
