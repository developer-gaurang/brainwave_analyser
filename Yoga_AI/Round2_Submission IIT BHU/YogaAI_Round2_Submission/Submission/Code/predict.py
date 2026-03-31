import os
import glob
from ultralytics import YOLO

def main():
    print("="*50)
    print("Starting Prediction Generation")
    print("="*50)

    # Paths
    # IMPORTANT: Update this path to where your BEST trained model is
    # [FIX] Point to sibling Results folder
    model_path = '../Results/best.pt'
    
    model_path = '../Results/best.pt'
    
    model = None
    try:
        # Check if we have a trained model
        if os.path.exists(model_path):
             print(f"Loading custom model from {model_path}...")
             model = YOLO(model_path)
        else:
             print(f"Warning: Custom model not found at {model_path}.")
             raise FileNotFoundError
    except Exception as e:
        print(f"Error loading custom model: {e}")
        print("Falling back to standard yolov8n.pt for demonstration purposes.")
        model = YOLO('yolov8n.pt')
    
    # Input/Output
    # [FIX] Point to root dataset folder
    test_images_dir = '../../../dataset/images/test' # User needs to put test images here
    output_dir = 'predictions'
    
    if not os.path.exists(test_images_dir):
        print(f"Error: Test directory '{test_images_dir}' not found.")
        print("Please create it and add your test images.")
        return

    os.makedirs(output_dir, exist_ok=True)

    # Get all images
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp']
    images = []
    for ext in extensions:
        images.extend(glob.glob(os.path.join(test_images_dir, ext)))
    
    print(f"Found {len(images)} images in {test_images_dir}")

    # Run Inference
    for img_path in images:
        filename = os.path.basename(img_path)
        file_id = os.path.splitext(filename)[0]
        
        # Run model
        results = model(img_path, verbose=False)[0]
        
        # Format: class_id center_x center_y width height
        txt_content = []
        for box in results.boxes:
            cls = int(box.cls[0].item())
            # xywhn returns normalized values (0-1) which is standard for YOLO TXT
            x, y, w, h = box.xywhn[0].tolist() 
            txt_content.append(f"{cls} {x:.6f} {y:.6f} {w:.6f} {h:.6f}")
            
        # Save to TXT
        out_path = os.path.join(output_dir, f"{file_id}.txt")
        with open(out_path, 'w') as f:
            f.write('\n'.join(txt_content))
            
    print(f"Predictions saved to '{output_dir}/'")

if __name__ == '__main__':
    main()
