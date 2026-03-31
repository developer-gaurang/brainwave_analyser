# 🧘 Yoga AI (Web) - AI ChakraFlow

> **Theme: Health and Fitness (Agentic System Track)**
> **The First "Aware" AI Yoga Instructor that Sees, Thinks, and Guides.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://yogaii.vercel.app/)

**Yoga AI** is not just a pose detector; it is an **Agentic System**. Unlike traditional computer vision apps that simply label what they see, Yoga AI possesses a "Brain" (`Agent Class`) that maintains session state, tracks stress levels via bio-feedback, and uses **Generative AI (Gemini)** to provide context-aware, wisdom-filled guidance—just like a real human teacher.

---

## 🧠 Why is this an "Agentic System"?

A true agent must **Perceive**, **Reason**, and **Act**. Here is how Yoga AI fulfills the "Agentic" criteria:

| Component | Function | Implementation |
| :--- | :--- | :--- |
| **1. Perception (Eyes/Ears)** | Sees Mudras, Posture, Breathing, and reads **Bio-Sensors**. | `MediaPipe` + `MAX30100 Impulse Sensor` |
| **2. Brain (Reasoning)** | Tracks session context ("Warmup" vs "Deep Flow"). Monitors Stress (HRV). Decides **WHEN** to speak. | `YogaAgent` Class + `Gemini 2.0 Flash` |
| **3. Action (Voice/UI)** | Speaks personalized corrections or philosophy. Changes UI/Music based on mood. | `pyttsx3` (TTS) + `PyGame` (Audio) |

> **"It doesn't just buzz when you're wrong; it encourages you when you're right."**

---

## 🌟 Key Features

### 👁️ Advanced Computer Vision
- **Real-time Mudra Detection**: Instantly recognizes sacred hand gestures including **Gyan**, **Surya**, **Prana**, **Namaste**.
- **Posture & Alignment**: Tracks body landmarks to ensure correct yoga forms.

### 🧠 The Neural Agent (New!)
- **State Awareness**: The Agent remembers your "Session Phase". It won't interrupt your flow unless necessary.
- **Stress-Responsive**: High Heart Rate + Poor Posture = **"Relaxation Protocol"** (Agent suggests breathwork).
- **Wisdom Injection**: Uses **Gemini AI** to explain the *spiritual significance* of your current pose, not just the physical alignment.
<div align="center">
  <img src="assets/images/vedic_flow.png" width="800" alt="Yoga AI Vedic Tech Flow">
</div>

# 🧘 YOGA AI: THE VEDIC ADVISOR
- **Heart & SpO2 Monitoring**: Integrates with hardware sensors to display real-time **Heart Rate (BPM)**.
- **Energy Coherence Radar**: Visualizes the harmony between your mind and body.

### 🎖️ HYPER-SYNC v2.5 Updates (Latest)
- **Level & Medal System**: Earn golden medals displayed at your neck after crossing level 3, with animated sparkles and level progression
- **Procedural Mudra Effects**: Clean, artifact-free brain and sun icons for Gyan and Surya mudras that fit perfectly in your palm
- **Responsive HUD**: All UI elements scale dynamically with camera resolution for perfect visibility on any screen
- **Enhanced Instruction Panel**: Properly aligned meditation guide with highlighted keywords (Lotus Pose, Hand Mudras, Eyes, Breath)
- **Immersive Branding**: Unified "YOGA AI: HYPER-SYNC v2.5 // IMMERSIVE" theme across Python backend and React frontend

---

### 🛸 Antigravity Meditation Concept
The future of Yoga AI involves immersive, floating environments.
<div align="center">
  <img src="assets/images/antigravity_chamber.png" width="600" alt="Antigravity Chamber">
</div>
### Arduino Heart Rate Sensor Hardware
![Arduino Sensor](assets/images/arduino_sensor.png)
*MAX30100 pulse oximeter sensor with real-time heart rate monitoring*

---

## 📸 Visual Demonstrations

### Python Backend UI (AI ChakraFlow Engine)
![Python UI Demo](assets/images/python_ui_demo.png)
*Real-time bio-analytics, chakra energy visualization, and mudra guide with meditation hints*

### 🧠 Two-Person Neuro Comparison
![Neuro Comparison](assets/neuro_comparison.png)
*Compare mental states and neural synchronization between two participants.*
> **[Explore the BrainWave Analyzer Repository](https://github.com/adityaIITG1/BrainWave-Analyzer-)**

---

## 🔄 System Architecture

Our solution follows a closed-loop **Agentic Workflow**:

```mermaid
graph TD
    User((User)) -->|Visual Input| Cam[Webcam]
    User -->|Bio-Data| Sensor[Heart Rate Sensor]
    
    subgraph "Perception Layer"
        Cam -->|Frames| MP[MediaPipe Vision]
        Sensor -->|Serial Data| HR[HR Monitor]
    end
    
    subgraph "Neural Brain (Agent)"
        MP -->|Pose/Face Data| State[Session State]
        HR -->|Stress Level| State
        State -->|Context| Logic{Agent Logic}
        Logic -->|Decision| LLM[Gemini 2.0 Flash]
    end
    
    subgraph "Action Layer"
        LLM -->|Wisdom/Advice| TTS[Voice Feedback]
        Logic -->|UI Update| Screen[Visual Overlay]
    end
    
    TTS -->|Audio| User
    Screen -->|Visuals| User
```

1.  **Observation**: 
    -   *Vision*: "User is holding Gyan Mudra."
    -   *Sensor*: "Heart Rate is 75 BPM (Calm)."
2.  **Reasoning (`agent.py`)**:
    -   *Context*: "User is in Warmup phase."
    -   *Logic*: "Good pose + Calm Heart = Ready for deeper wisdom."
    -   *Decision*: **TRIGGER_EXPLANATION** (Call LLM).
3.  **Action**:
    -   *LLM*: Generates a short, poetic insight about "Focus and Stability."
    -   *TTS*: Speaks the insight to the user.

---

## ⚖️ Ethics, Safety & Limitations

**Constraints & Rules Compliance:**
-   **Open Source**: All libraries used (MediaPipe, OpenCV) are open source.
-   **LLM API**: Uses Google Gemini Free Tier.
-   **Privacy**: All video processing happens **locally**. Images are not uploaded to the cloud (only anonymized text prompts are sent to Gemini).

**Limitations:**
1.  **Medical Advice**: This system is for **wellness and educational purposes only**. It is not a medical device. The "Heart Rate" readings are estimations.
2.  **Environment**: Requires good lighting for accurate computer vision detection.
3.  **Latency**: TTS response time depends on internet connection for the Gemini API.

**Future Improvements:**
-   **Edge AI**: Running the LLM locally (e.g., Gemma 2B) for offline capability.
-   **Multi-User**: Tracking multiple people in a class setting.

---

## 🛠️ Tech Stack

- **Web Interface**: Next.js 15 + Tailwind CSS (Premium Glassmorphic UI)
- **Cortex**: Google Gemini 2.0 Flash (Reasoning)
- **Vision**: MediaPipe (Task-Vision Web)
- **Animations**: Framer Motion
- **Hardware**: Arduino + MAX30100 (Bio-Feedback via Web Serial)

---

## 🚀 Getting Started

### 🌐 Option 1: Premium Web Interface (Highly Recommended)
Experience the futuristic **Neon Dashboard** with glassmorphism and real-time animations.

1.  **Clone & Setup**:
    ```bash
    git clone https://github.com/adityaIITG1/YOGA-AI-IITH-HACATHON.git
    cd yoga-ai-web
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
3.  **Open Browser**: Visit `http://localhost:3000`. Connect your sensor via the **"Connect"** button (uses Web Serial).

### 🐍 Option 2: Native Python Application
The original robust local environment with real-time OpenCV overlays.

1.  **Navigate to Directory**:
    ```bash
    cd native-python-app
    pip install -r requirements.txt
    ```
2.  **Run**:
    ```bash
    python yogi.py
    ```

---

## 👨‍💻 Submission Highlights

-   **`native-python-app/agent.py`**: The file where the "Reasoning" happens.
-   **`native-python-app/yogi.py`**: The main loop connecting Vision to Brain.
-   **`ai_explainer.py`**: The bridge to the LLM.

---

## 🎥 Video Demonstration

- **YouTube Short**: [Watch Demo](https://youtube.com/shorts/F-6WMswfo4M?si=3ZmhGJcTlJCQPOqC)
