/**
 * useAuth Hook
 * 
 * React hook for authentication state management
 */

"use client";

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut as authSignOut,
    onAuthChange,
} from '../lib/auth';
import { getUserProfile, type UserProfile } from '../lib/firestore';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthChange(async (authUser) => {
            setUser(authUser);

            if (authUser) {
                // Load user profile (gracefully handle Firestore errors)
                try {
                    const userProfile = await getUserProfile(authUser.uid);
                    setProfile(userProfile);
                } catch (err) {
                    console.warn('Could not load user profile from Firestore:', err);
                    // Create a basic profile from auth data
                    setProfile({
                        uid: authUser.uid,
                        name: authUser.displayName || 'Yogi',
                        email: authUser.email || '',
                        photoURL: authUser.photoURL || undefined,
                        createdAt: Timestamp.fromDate(new Date()),
                        preferences: {
                            favoriteMudras: [],
                            sessionGoal: 20,
                        },
                        stats: {
                            totalSessions: 0,
                            totalMinutes: 0,
                            currentStreak: 0,
                            bestStreak: 0,
                        },
                    });
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    /**
     * Sign in with Google
     */
    const googleSignIn = async () => {
        try {
            setError(null);
            const user = await signInWithGoogle();
            try {
                const userProfile = await getUserProfile(user.uid);
                setProfile(userProfile);
            } catch (err) {
                console.warn('Could not load profile, using auth data:', err);
                // Profile will be set from auth state change
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
            throw err;
        }
    };

    /**
     * Sign up with email/password
     */
    const emailSignUp = async (email: string, password: string, name: string) => {
        try {
            setError(null);
            const user = await signUpWithEmail(email, password, name);
            try {
                const userProfile = await getUserProfile(user.uid);
                setProfile(userProfile);
            } catch (err) {
                console.warn('Could not load profile, using auth data:', err);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign up');
            throw err;
        }
    };

    /**
     * Sign in with email/password
     */
    const emailSignIn = async (email: string, password: string) => {
        try {
            setError(null);
            const user = await signInWithEmail(email, password);
            try {
                const userProfile = await getUserProfile(user.uid);
                setProfile(userProfile);
            } catch (err) {
                console.warn('Could not load profile, using auth data:', err);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
            throw err;
        }
    };

    /**
     * Sign out
     */
    const signOut = async () => {
        try {
            setError(null);
            await authSignOut();
            setProfile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign out');
            throw err;
        }
    };

    return {
        user,
        profile,
        loading,
        error,
        googleSignIn,
        emailSignUp,
        emailSignIn,
        signOut,
        isAuthenticated: !!user,
    };
}
