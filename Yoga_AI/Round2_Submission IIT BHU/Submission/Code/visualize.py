import os
import cv2
import glob
import random

def main():
    print("="*50)
    print("Starting Prediction Visualization")
    print("="*50)

    # Paths
    img_dir = 'test_images'
    lbl_dir = 'predictions'
    out_dir = '../Results/visualized_predictions'
    
    # Class Names (Must match data.yaml)
    class_names = [
        "Tree Pose", "Warrior II", "Downward Dog", "Cobra", "Plank",
        "Gyan Mudra", "Prana Mudra", "Prithvi Mudra", "Varun Mudra", "Surya Mudra"
    ]
    
    # Colors for classes
    colors = {}
    for i in range(len(class_names)):
        colors[i] = (random.randint(0,255), random.randint(0,255), random.randint(0,255))

    os.makedirs(out_dir, exist_ok=True)

    if not os.path.exists(img_dir):
        print(f"Error: {img_dir} not found.")
        return

    # Process
    img_files = glob.glob(os.path.join(img_dir, '*.*'))
    img_files = [f for f in img_files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    if not img_files:
        print("No images found to visualize.")
        return

    print(f"Visualizing {len(img_files)} images...")

    for img_path in img_files:
        basename = os.path.basename(img_path)
        file_id = os.path.splitext(basename)[0]
        lbl_path = os.path.join(lbl_dir, file_id + '.txt')

        img = cv2.imread(img_path)
        if img is None:
            continue
            
        h, w = img.shape[:2]

        if os.path.exists(lbl_path):
            with open(lbl_path, 'r') as f:
                lines = f.readlines()
                
            for line in lines:
                parts = line.strip().split()
                if len(parts) >= 5:
                    cls = int(parts[0])
                    cx, cy, bw, bh = map(float, parts[1:5])
                    
                    # De-normalize
                    x1 = int((cx - bw/2) * w)
                    y1 = int((cy - bh/2) * h)
                    x2 = int((cx + bw/2) * w)
                    y2 = int((cy + bh/2) * h)
                    
                    label = class_names[cls] if cls < len(class_names) else str(cls)
                    color = colors.get(cls, (0,255,0))
                    
                    cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
        
        out_path = os.path.join(out_dir, basename)
        cv2.imwrite(out_path, img)
        print(f"Saved: {out_path}")

    print("Visualization Complete.")

if __name__ == "__main__":
    main()
