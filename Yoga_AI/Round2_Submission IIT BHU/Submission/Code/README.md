# YogaAI - Round 2 Submission

## Overview
This repository contains the training code, inference scripts, and results for the YogaAI Pose & Mudra Detection System.

## Features
- **YOLOv8-Nano Architecture**: Optimized for real-time edge performance.
- **9 Classes**:
    - 0-4: Standard Yoga Poses (Tree, Warrior II, Downward Dog, Cobra, Plank)
    - 5-9: Mudras (Gyan, Prana, Prithvi, Varun, Surya)
- **Visualized Predictions**: Automatically draws bounding boxes on test images.

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running Predictions
To generate predictions on the sample images provided in `test_images/`:
```bash
python predict.py
```
Results will be saved in `predictions/` (TXT labels).

## visualizing Results
To see the model in action with bounding boxes drawn:
```bash
python visualize.py
```
Visualized images will be saved in `../Results/visualized_predictions/`.

## Training
To retrain the model (requires dataset):
```bash
python train.py
```
