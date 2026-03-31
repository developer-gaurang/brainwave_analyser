import os
import torch
from ultralytics import YOLO

def main():
    print("="*50)
    print("Starting YogaAI Model Training")
    print("="*50)

    # 1. Check Device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device.upper()}")
    if device == 'cpu':
        print("WARNING: Training on CPU will be slow.")

    # 2. Initialize Model
    # Using 'yolov8n.pt' (nano) for speed and efficiency. 
    # Can allow 'yolov8s.pt' or 'yolo11n.pt' if installed.
    model_name = 'yolo11n.pt' 
    if not os.path.exists(model_name) and not os.path.exists('yolov8n.pt'):
         print(f"Model weights not found locally, will download {model_name}...")
    
    try:
        model = YOLO(model_name) 
    except Exception:
        print(f"Could not load {model_name}, falling back to yolov8n.pt")
        model = YOLO('yolov8n.pt')

    # 3. Train
    # Assuming data.yaml is valid and dataset is in place
    try:
        results = model.train(
            data='data.yaml',
            epochs=1,          # Demo mode: 1 epoch
            imgsz=640,          # Standard image size
            batch=16,           # Batch size (reduce if memory issues)
            name='yoga_ai_round2', # Experiment name
            device=0 if device == 'cuda' else 'cpu',
            patience=10,        # Early stopping
            verbose=True
        )
        print("Training Completed Successfully!")
        print(f"Best model saved at: {results.save_dir}/weights/best.pt")
        
    except Exception as e:
        print(f"ERROR during training: {e}")
        print("Please ensure 'dataset/' folder is populated and 'data.yaml' is correct.")

if __name__ == '__main__':
    main()
