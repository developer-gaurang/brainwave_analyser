# Firebase Integration - Quick Setup Guide

## ✅ What's Been Created

### Backend (Complete)
- ✅ `lib/firebase.ts` - Firebase configuration
- ✅ `lib/auth.ts` - Authentication helpers (Google + Email/Password)
- ✅ `lib/firestore.ts` - Database operations (users, sessions, progress)

### React Hooks (Complete)
- ✅ `hooks/useAuth.ts` - Authentication state management
- ✅ `hooks/useSessionTracking.ts` - Session tracking & saving

### UI Components (In Progress)
- ✅ `components/AuthModal.tsx` - Beautiful onboarding modal

---

## 🔧 Firebase Console Setup Required

### 1. Enable Authentication
1. Go to https://console.firebase.google.com/u/0/project/yoga-ai-151bb/authentication
2. Click "Get Started"
3. Enable **Google** sign-in provider
4. Enable **Email/Password** sign-in provider
5. Add authorized domain: `localhost`

### 2. Create Firestore Database
1. Go to https://console.firebase.google.com/u/0/project/yoga-ai-151bb/firestore
2. Click "Create Database"
3. Choose **Production mode**
4. Select region: **us-central1**
5. Click "Enable"

### 3. Set Security Rules
In Firestore Rules tab, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    match /progress/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web app" (</> icon)
4. Register app: "Yoga AI Web"
5. Copy the config values

---

## 📝 Environment Variables

Add to `.env.local`:

```bash
# Firebase Config (from step 4 above)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yoga-ai-151bb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yoga-ai-151bb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yoga-ai-151bb.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Existing
GEMINI_API_KEY=your_gemini_key
```

---

## 🚀 Next Steps

I still need to create:
1. User profile dropdown in TopBar
2. Progress dashboard component
3. Integration into YogaCanvas
4. Session summary modal

**Ready for me to continue?** Just say "continue" and I'll finish the implementation!

---

## 🧪 Testing Checklist

Once complete, test:
- [ ] Open app → Auth modal appears
- [ ] Sign in with Google → Profile created
- [ ] Start session → Data tracked
- [ ] End session → Saved to Firestore
- [ ] Refresh page → Auto-login works
- [ ] View profile → See stats

---

**Status**: 60% Complete
**Time Remaining**: ~30 minutes
