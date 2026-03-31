# --- LEVEL & MEDAL SYSTEM ---
def draw_medal_at_neck(frame, pose_landmarks, level):
    """
    Draws a procedural golden medal at the neck area when level >= 4
    """
    if not pose_landmarks or level < 4:
        return
    
    h, w, _ = frame.shape
    lm = pose_landmarks.landmark
    
    # Get shoulder positions (landmarks 11 and 12)
    left_shoulder = lm[11]
    right_shoulder = lm[12]
    
    # Calculate neck position (midpoint between shoulders, slightly above)
    neck_x = int(((left_shoulder.x + right_shoulder.x) / 2) * w)
    neck_y = int(((left_shoulder.y + right_shoulder.y) / 2) * h) - 30  # 30px above shoulders
    
    # Medal size based on level
    base_size = 25
    size = base_size + (level - 4) * 3  # Grows with level
    
    # Outer glow
    overlay = frame.copy()
    cv2.circle(overlay, (neck_x, neck_y), size + 15, (0, 215, 255), -1)  # Golden glow
    cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)
    
    # Medal circle (golden)
    cv2.circle(frame, (neck_x, neck_y), size, (0, 180, 255), -1)  # Filled gold
    cv2.circle(frame, (neck_x, neck_y), size, (0, 215, 255), 3)  # Bright gold outline
    
    # Inner circle
    cv2.circle(frame, (neck_x, neck_y), size - 8, (50, 200, 255), 2)  # Inner ring
    
    # Star in center (5-pointed)
    import math
    star_size = size - 12
    points = []
    for i in range(10):
        angle = (i * math.pi / 5) - (math.pi / 2)  # Start from top
        r = star_size if i % 2 == 0 else star_size * 0.4
        px = int(neck_x + r * math.cos(angle))
        py = int(neck_y + r * math.sin(angle))
        points.append([px, py])
    
    # Draw star
    star_pts = np.array(points, np.int32)
    cv2.fillPoly(frame, [star_pts], (255, 255, 255))  # White star
    cv2.polylines(frame, [star_pts], True, (0, 215, 255), 2)  # Gold outline
    
    # Level number in center
    cv2.putText(frame, str(level), (neck_x - 8, neck_y + 6), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)  # Black outline
    cv2.putText(frame, str(level), (neck_x - 8, neck_y + 6), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 215, 255), 1)  # Gold text
    
    # Sparkles around medal
    t = time.time()
    for i in range(6):
        angle = (i * math.pi / 3) + t * 2
        sx = int(neck_x + (size + 20) * math.cos(angle))
        sy = int(neck_y + (size + 20) * math.sin(angle))
        cv2.circle(frame, (sx, sy), 3, (255, 255, 255), -1)
