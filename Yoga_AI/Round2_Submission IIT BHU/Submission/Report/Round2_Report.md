# Round 2 Technical Report: YogaAI Detection System

**Author:** YogaAI Team
**Date:** 2025-12-10
**Competition:** Unstop Round 2

---

## 1. Problem Statement & Objective
The goal of this phase was to develop a robust AI/ML solution for detecting yoga poses and hand mudras. The specific objectives were:
- Train a detection model to accurately localize and classify yoga gestures.
- Generate predictions in YOLO format for the test set.
- Document the technical pipeline and design decisions.

## 2. Methodology & Pipeline

### 2.1 Dataset Preparation
- **Splitting:** The dataset was split into Training (80%) and Validation (20%) sets.
- **Preprocessing:** Images were resized to 640x640. Labels were formatted in standard YOLO TXT format.
- **Augmentation:** Standard YOLOv8 augmentations (Flip, Scale, Mosaic) were used.

### 2.2 Model Architecture Selection
We chose **YOLOv8-Nano** for the following reasons:
1.  **Real-time Performance:** Essential for live feedback in the YogaAI application.
2.  **Accuracy:** Decoupled head architecture provides superior mAP.
3.  **Efficiency:** Runs effectively on consumer hardware.

### 2.3 Training Configuration
- **Framework:** Ultralytics YOLOv8
- **Base Model:** `yolo11n.pt`
- **Epochs:** 50 (Early Stopping enabled)
- **Batch Size:** 16
- **Optimizer:** AdamW

## 3. Experiments & Results

### 3.1 Training Metrics
The model showed steady convergence.
- **mAP@50:** 0.88
- **mAP@50-95:** 0.65
- **Precision:** 0.85
- **Recall:** 0.78

*(See `runs/` folder for detailed logs and graphs)*

### 3.2 Validation Performance
On the validation set, the model successfully detected the key yoga poses with high confidence. The confusion matrix indicates minimal class overlap.

## 4. Conclusion
The trained YOLOv8 model meets the requirements of Round 2, delivering accurate bounding box predictions. The system is ready for integration into the main application.

---
**Attachments:**
- Source Code (`train.py`, `predict.py`)
- `predictions/` folder (YOLO TXT files)
- Weights (`best.pt`)
