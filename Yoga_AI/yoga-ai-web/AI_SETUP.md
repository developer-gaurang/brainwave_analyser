# 🧘 Agentic AI Integration - Setup Guide

## What's New?

Your Yoga AI web app now has a **fully functional agentic AI system** powered by Google Gemini! The AI coach:

- 🧠 **Thinks Contextually**: Understands your session phase, stress levels, and energy state
- 💬 **Speaks Wisely**: Provides personalized guidance based on mudras, meditation state, and biofeedback
- 🎯 **Decides Intelligently**: Knows when to speak and when to stay silent
- 📊 **Tracks Progress**: Monitors your session from WARMUP → FLOW → MEDITATION → COOLDOWN

---

## Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Configure Environment

Create a file named `.env.local` in the `yoga-ai-web` directory:

```bash
# In yoga-ai-web directory
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

**Replace `your_api_key_here` with your actual API key!**

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

### 🎨 Beautiful AI Coach Panel

- **Glassmorphic Design**: Premium floating panel with dynamic colors
- **Session Phase Indicators**: Visual badges for WARMUP/FLOW/MEDITATION/COOLDOWN
- **Bio Stats Display**: Shows heart rate and energy levels
- **Guidance History**: Keeps track of last 3 AI messages
- **Animated Thinking State**: Pulsing brain icon when AI is processing

### 🧠 Intelligent Agent System

The AI agent (`utils/yoga-agent.ts`) maintains session state and decides when to provide guidance:

**Decision Priority:**
1. **High Stress Detection** → Calming guidance
2. **Meditation Encouragement** → Deep practice support
3. **Mudra Philosophy** → Spiritual wisdom via Gemini
4. **General Encouragement** → Energy celebration

**Cooldown System:**
- 10-second minimum between guidance messages
- Prevents spam while keeping AI responsive

### 📚 Mudra Wisdom Database

Complete scriptural knowledge for:
- Gyan Mudra (Knowledge)
- Surya Mudra (Fire)
- Prana Mudra (Life Force)
- Apana Mudra (Purification)
- Varun Mudra (Water)
- Namaste/Anjali Mudra (Unity)

Each mudra includes:
- Sanskrit name
- Element association
- Chakra connection
- Benefits
- Scriptural significance

---

## How It Works

### Architecture

```
User Practice
    ↓
Vision Detection (MediaPipe)
    ↓
Agent State Update
    ↓
Decision Engine
    ↓
Gemini API (if needed)
    ↓
Voice + UI Guidance
```

### Integration Points

1. **Animation Loop** (YogaCanvas.tsx ~line 670)
   - Updates agent state every frame
   - Requests guidance when appropriate

2. **API Route** (`app/api/ai-guidance/route.ts`)
   - Secure server-side Gemini calls
   - Keeps API key hidden from client

3. **AI Coach Panel** (Bottom-left corner)
   - Displays guidance with animations
   - Shows session phase and bio stats

---

## Testing

### Test Scenario 1: Mudra Detection

1. Start the app
2. Perform **Gyan Mudra** (thumb + index finger touching)
3. **Expected**: AI coach panel appears with wisdom about knowledge
4. **Expected**: Voice speaks the guidance

### Test Scenario 2: Meditation

1. Close your eyes for 2+ seconds
2. **Expected**: Session phase changes to "MEDITATION"
3. **Expected**: AI provides meditation-specific encouragement
4. **Expected**: Energy bars rise faster

### Test Scenario 3: Stress Response

1. Connect Arduino heart rate sensor
2. Elevate heart rate (exercise/rapid breathing)
3. **Expected**: AI detects stress and provides calming guidance

### Test Scenario 4: Fallback Mode

1. Don't set `GEMINI_API_KEY` in `.env.local`
2. Perform mudras
3. **Expected**: Hardcoded wisdom messages appear (no API calls)
4. **Expected**: No errors, app works normally

---

## Customization

### Adjust Guidance Cooldown

In `utils/yoga-agent.ts`:

```typescript
private readonly GUIDANCE_COOLDOWN = 10000; // Change to 5000 for 5 seconds
```

### Modify Stress Threshold

```typescript
private readonly STRESS_THRESHOLD = 70; // Lower = more sensitive
```

### Add New Mudras

Edit `utils/mudra-wisdom.ts`:

```typescript
export const MUDRA_DATABASE: Record<string, MudraWisdom> = {
    "YourMudra": {
        sanskrit: "Sanskrit Name",
        meaning: "Meaning",
        element: "Element",
        chakra: "Chakra",
        benefits: ["Benefit 1", "Benefit 2"],
        scripture: "Scriptural significance"
    },
    // ... existing mudras
};
```

---

## Troubleshooting

### AI Panel Not Appearing

- **Check**: Is `GEMINI_API_KEY` set in `.env.local`?
- **Check**: Did you restart the dev server after adding the key?
- **Check**: Are you performing mudras correctly?

### "API Error" in Console

- **Check**: Is your API key valid?
- **Check**: Do you have internet connection?
- **Fallback**: App will use hardcoded messages automatically

### Voice Not Speaking

- **Check**: Browser permissions for audio
- **Check**: System volume is not muted
- **Note**: Voice synthesis works in Chrome/Edge (best support)

---

## Files Created

### Core System
- `utils/yoga-agent.ts` - AI agent brain
- `utils/ai-coach.ts` - Gemini API integration
- `utils/mudra-wisdom.ts` - Knowledge database
- `app/api/ai-guidance/route.ts` - Secure API endpoint

### React Integration
- `hooks/useYogaAgent.ts` - Agent lifecycle hook
- `hooks/useAICoach.ts` - API call hook
- `components/AICoachPanel.tsx` - Beautiful UI panel

### Modified
- `components/YogaCanvas.tsx` - Integrated AI system

---

## API Usage

The app uses **Gemini 2.0 Flash Exp** model:
- **Free tier**: 15 requests per minute
- **Cost**: Free for development
- **Response time**: ~1-2 seconds

**Optimization:**
- Response caching (1 minute)
- Request debouncing (5 seconds)
- Fallback messages when offline

---

## Next Steps

1. **Add Voice Input**: Allow users to ask questions
2. **Session Analytics**: Track progress over time
3. **Personalization**: Learn user preferences
4. **Multi-Language**: Support Hindi, Sanskrit

---

## Support

For issues or questions:
1. Check console for error messages
2. Verify `.env.local` configuration
3. Test with fallback mode (no API key)

**Enjoy your intelligent yoga companion! 🧘‍♀️✨**
