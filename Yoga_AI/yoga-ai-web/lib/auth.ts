/**
 * Authentication Helpers
 * 
 * Functions for user authentication with Google and Email/Password
 */

import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './firestore';

// ==================== GOOGLE SIGN-IN ====================

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User> {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user profile exists, create if not (gracefully handle Firestore errors)
        try {
            const profile = await getUserProfile(user.uid);
            if (!profile) {
                await createUserProfile(
                    user.uid,
                    user.displayName || 'Yogi',
                    user.email || '',
                    user.photoURL || undefined
                );
            }
        } catch (err) {
            console.warn('Could not create/fetch Firestore profile (Firestore may not be configured):', err);
            // Continue anyway - auth still works without Firestore
        }

        return user;
    } catch (error: any) {
        // Handle specific Firebase auth errors
        if (error.code === 'auth/popup-blocked') {
            throw new Error('Popup was blocked by your browser. Please allow popups for this site.');
        } else if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in cancelled. Please try again.');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Please check your internet connection.');
        } else if (error.code === 'auth/unauthorized-domain') {
            throw new Error('This domain is not authorized. Please contact support.');
        } else {
            console.error('Google sign-in error:', error);
            throw new Error(error.message || 'Failed to sign in with Google. Please try again.');
        }
    }
}

// ==================== EMAIL/PASSWORD ====================

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    name: string
): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create user profile
    await createUserProfile(user.uid, name, email);

    return user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
}

// ==================== SIGN OUT ====================

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
}

// ==================== AUTH STATE ====================

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}
