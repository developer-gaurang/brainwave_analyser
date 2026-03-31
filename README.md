# ðŸ§˜â€ â™‚ï¸ YogaAI Ã— BrainWave Analyzer ðŸ§ 
### **Merging Ancient Wisdom with Agentic Intelligence & Neuro-Bio-Feedback**

![Hero Vision](assets/hero_vision.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg)](https://nextjs.org/)
[![YOLOv8](https://img.shields.io/badge/Vision-YOLOv8-red.svg)](https://ultralytics.com/)
[![Gemini 2.0 Flash](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-vibrant.svg)](https://deepmind.google/technologies/gemini/)

---

## ðŸŒŸ The Vision
**YogaAI** is not just an app; it's a closed-loop **Agentic Wellness Ecosystem**. By combining high-precision computer vision (YOLOv8 & MediaPipe) with real-time bio-telemetry (EEG Brainwaves & HEART_RATE), we've created a digital sanctuary that understands your physical form and mental state simultaneously.

> "True health is the synchronization of the body, the breath, and the mind."

---

## âœ¨ Key Pillars

### ðŸ‘ 1. Vision Core (YOLOv8-Nano)
Detects **5 Yoga Poses** and **5 Sacred Mudras** with edge-optimized real-time frequency.
- **Poses**: Tree, Warrior II, Downward Dog, Cobra, Plank.
- **Mudras**: Gyan, Prana, Prithvi, Varun, Surya.
- *Technology*: Custom trained YOLOv8 model for ultra-low latency.

### ðŸ§  2. Neuro-Link Sync
Analyzes **EEG Brainwave patterns** and **Neural Synchronization** between participants.
- Real-time visualization of Alpha, Beta, and Delta waves.
- Stress Level analysis derived from Heart Rate variability.
- *Technology*: Arduino-based sensors with high-frequency serial stream.

### ðŸ¤– 3. Agentic Wisdom (Gemini 2.0 Flash)
Your session isn't just monitored; it's **guided**.
- Gemini-powered AI Wellness Coach provides real-time voice feedback.
- Context-aware advice based on current Pose accuracy and Bio-stress levels.
- *Technology*: Zero-shot reasoning via Gemini 2.0.

---

## ðŸ–¥ï¸ Premium Dashboard

![Dashboard Mockup](assets/dashboard_mockup.png)

---

## ðŸ’» System Architecture

```mermaid
graph TD
    User((User)) -->|Visual Input| Cam[Webcam]
    User -->|Bio-Data| Sensor[Heart Rate / EEG Sensor]

    subgraph "Perception Layer"
        Cam -->|Frames| MP[MediaPipe Vision]
        Cam -->|Frames| YOLO[YOLOv8 Yoga Engine]
        Sensor -->|Serial Data| HR[Bio-Data Stream]
    end

    subgraph "Neural Brain (Gemini Agent)"
        MP -->|Skeletal Pose| State[Session State]
        YOLO -->|Mudra/Pose Classification| State
        HR -->|Neuro-Stress Analysis| State
        State -->|Context| Logic{Agentic Logic}
        Logic -->|Decision| LLM[Gemini 2.0 Flash]
    end
    
    subgraph "Action Layer"
        LLM -->|Voice Wisdom| TTS[Voice Feedback]
        Logic -->|Real-time Overlay| Screen[UI Dashboard]
    end
```

---

## ðŸš€ Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, Framer Motion (for liquid UI).
- **Computer Vision**: YOLOv8-Nano, MediaPipe, OpenCV.
- **Generative AI**: Google Gemini 2.0 Flash (Agentic reasoning).
- **Internet of Things (IoT)**: Arduino, C++, Serial Communication.
- **Data Engineering**: NumPy, Matplotlib (for EEG signal processing).

---

## ðŸ“¦ Installation & Usage

### 1. Vision Engine
```bash
cd Yoga_AI/Round2_Submission\ IIT\ BHU/Submission/Code
pip install -r requirements.txt
python predict.py # Test the model
python visualize.py # See detection visuals
```

### 2. Web Dashboard
```bash
cd neuro-link-app
npm install
npm run dev
```

### 3. Neuro-Hardware
- Flash the `.ino` files found in `arduino_eeg` and `arduino_heart_rate` to your compatible Arduino/ESP32 board.

---

## ðŸ“ˆ Roadmap
- [ ] Multi-user Neural Synchronization Dashboard.
- [ ] Personalized Ayurvedic health recommendations via RAG (Retrieval Augmented Generation).
- [ ] Integration with VR for Immersive Yoga environments.

---

## ðŸ¤ Contributing
We believe in the power of open-source wellness. Pull requests for new Poses, Mudras, or improved EEG signal processing are welcome!

## ðŸ“œ License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>Built with â¤ï¸ by Aditya & Gaurang</b><br>
  <i>Transforming the future of Wellness through AI</i>
</p>
