import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Helper to calculate squared distance between two landmarks (2D)
function distSq(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}

// Helper to calculate Euclidean distance (2D)
function dist(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
    return Math.sqrt(distSq(p1, p2));
}

// Helper to get hand scale (wrist to middle finger tip)
function getHandScale(landmarks: NormalizedLandmark[]): number {
    const wrist = landmarks[0];
    const midTip = landmarks[12];
    // Avoid zero division
    return dist(wrist, midTip) + 1e-6;
}

// --- SINGLE HAND MUDRAS ---

export function detectVayuMudra(landmarks: NormalizedLandmark[]): boolean {
    // Vayu: Index folded to base of thumb, thumb presses index (knuckle)
    // Index Tip (8) close to Thumb MCP (2)
    const indexTip = landmarks[8];
    const thumbMcp = landmarks[2];
    const handScale = getHandScale(landmarks);

    const d = dist(indexTip, thumbMcp) / handScale;

    // Other fingers extended
    const wrist = landmarks[0];
    const middleExt = distSq(landmarks[12], wrist) > distSq(landmarks[10], wrist);
    const ringExt = distSq(landmarks[16], wrist) > distSq(landmarks[14], wrist);
    const pinkyExt = distSq(landmarks[20], wrist) > distSq(landmarks[18], wrist);

    return d < 0.35 && middleExt && ringExt && pinkyExt;
}

export function detectShunyaMudra(landmarks: NormalizedLandmark[]): boolean {
    // Shunya: Middle folded to base of thumb, thumb presses middle
    // Middle Tip (12) close to Thumb MCP (2)
    const midTip = landmarks[12];
    const thumbMcp = landmarks[2];
    const handScale = getHandScale(landmarks);

    const d = dist(midTip, thumbMcp) / handScale;

    // Other fingers extended
    const wrist = landmarks[0];
    const indexExt = distSq(landmarks[8], wrist) > distSq(landmarks[6], wrist);
    const ringExt = distSq(landmarks[16], wrist) > distSq(landmarks[14], wrist);
    const pinkyExt = distSq(landmarks[20], wrist) > distSq(landmarks[18], wrist);

    return d < 0.35 && indexExt && ringExt && pinkyExt;
}

export function detectPrithviMudra(landmarks: NormalizedLandmark[]): boolean {
    // Prithvi: Ring tip touches Thumb tip. (Similar to Surya but not folded)
    const thumbTip = landmarks[4];
    const ringTip = landmarks[16];
    const handScale = getHandScale(landmarks);

    const d = dist(thumbTip, ringTip) / handScale;

    // Check Ring is NOT folded tightly to palm (unlike Surya)
    const wrist = landmarks[0];
    const ringPip = landmarks[14];
    // If ring is folded, Tip is closer to wrist than PIP?
    const ringExtended = distSq(ringTip, wrist) > distSq(ringPip, wrist);

    const indexExt = distSq(landmarks[8], wrist) > distSq(landmarks[6], wrist);
    const middleExt = distSq(landmarks[12], wrist) > distSq(landmarks[10], wrist);
    const pinkyExt = distSq(landmarks[20], wrist) > distSq(landmarks[18], wrist);

    return d < 0.30 && ringExtended && indexExt && middleExt && pinkyExt;
}

export function detectAdiMudra(landmarks: NormalizedLandmark[]): boolean {
    // Adi: Thumb tucked into palm, fingers curled over thumb (Fist)
    // Thumb Tip (4) close to Pinky MCP (17) or base?
    // All fingers curled.
    const wrist = landmarks[0];

    // Check all fingers curled
    const indexFolded = distSq(landmarks[8], wrist) < distSq(landmarks[6], wrist);
    const midFolded = distSq(landmarks[12], wrist) < distSq(landmarks[10], wrist);
    const ringFolded = distSq(landmarks[16], wrist) < distSq(landmarks[14], wrist);
    const pinkyFolded = distSq(landmarks[20], wrist) < distSq(landmarks[18], wrist);

    // Thumb tip covered? Hard to detect.
    // Generally a fist.
    return indexFolded && midFolded && ringFolded && pinkyFolded;
}

export function detectAbhayaMudra(landmarks: NormalizedLandmark[]): boolean {
    // Abhaya: Palm open, fingers up. (Right hand usually)
    // All fingers extended.
    const wrist = landmarks[0];
    const handScale = getHandScale(landmarks);

    const indexExt = distSq(landmarks[8], wrist) > distSq(landmarks[6], wrist);
    const midExt = distSq(landmarks[12], wrist) > distSq(landmarks[10], wrist);
    const ringExt = distSq(landmarks[16], wrist) > distSq(landmarks[14], wrist);
    const pinkyExt = distSq(landmarks[20], wrist) > distSq(landmarks[18], wrist);
    const thumbExt = distSq(landmarks[4], wrist) > distSq(landmarks[2], wrist);

    // Check separation? No, just open hand.
    // Check orientation? Wrist y > Finger y (Hand Up).
    // In MediaPipe coords, y increases downwards. So Wrist Y > Finger Y.
    const isUpright = wrist.y > landmarks[12].y;

    return indexExt && midExt && ringExt && pinkyExt && thumbExt && isUpright;
}

export function detectChinMudra(landmarks: NormalizedLandmark[]): boolean {
    // Chin: Same geometry as Gyan (Index Tip touches Thumb Tip).
    // Differentiated by context or just alias.
    // We will use Gyan detection strict logic.
    return detectGyanMudra(landmarks);
}

export function detectGyanMudra(landmarks: NormalizedLandmark[]): boolean {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const wrist = landmarks[0];
    const handScale = getHandScale(landmarks);

    const d = dist(thumbTip, indexTip) / handScale;

    // Check if other fingers are extended to avoid false positives
    const middleExt = distSq(landmarks[12], wrist) > distSq(landmarks[10], wrist);
    const ringExt = distSq(landmarks[16], wrist) > distSq(landmarks[14], wrist);
    const pinkyExt = distSq(landmarks[20], wrist) > distSq(landmarks[18], wrist);

    return d < 0.35 && middleExt && ringExt && pinkyExt;
}

export function detectPranaMudra(landmarks: NormalizedLandmark[]): boolean {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const handScale = getHandScale(landmarks);

    const dRing = dist(thumbTip, ringTip) / handScale;
    const dPinky = dist(thumbTip, pinkyTip) / handScale;

    // Check if index and middle are extended
    // (Tip further from wrist than PIP joint)
    const indexExt = distSq(landmarks[8], wrist) > distSq(landmarks[6], wrist);
    const middleExt = distSq(landmarks[12], wrist) > distSq(landmarks[10], wrist);

    return dRing < 0.35 && dPinky < 0.35 && indexExt && middleExt;
}

export function detectApanaMudra(landmarks: NormalizedLandmark[]): boolean {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const midTip = landmarks[12];
    const ringTip = landmarks[16];
    const handScale = getHandScale(landmarks);

    const dMid = dist(thumbTip, midTip) / handScale;
    const dRing = dist(thumbTip, ringTip) / handScale;

    const indexExt = distSq(landmarks[8], wrist) > distSq(landmarks[6], wrist);
    const pinkyExt = distSq(landmarks[20], wrist) > distSq(landmarks[18], wrist);

    return dMid < 0.35 && dRing < 0.35 && indexExt && pinkyExt;
}

export function detectSuryaMudra(landmarks: NormalizedLandmark[]): boolean {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const ringTip = landmarks[16];
    const ringPip = landmarks[14];
    const handScale = getHandScale(landmarks);

    // Check if ring finger is folded (Tip closer to wrist than PIP)
    const ringFolded = distSq(ringTip, wrist) < distSq(ringPip, wrist);

    // Check if thumb is over ring finger (Thumb tip close to Ring PIP)
    const dThumbRing = dist(thumbTip, ringPip) / handScale;

    return ringFolded && dThumbRing < 0.35;
}

export function detectVarunMudra(landmarks: NormalizedLandmark[]): boolean {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const pinkyTip = landmarks[20];
    const handScale = getHandScale(landmarks);

    const dPinky = dist(thumbTip, pinkyTip) / handScale;

    const indexExt = distSq(landmarks[8], wrist) > distSq(landmarks[6], wrist);
    const midExt = distSq(landmarks[12], wrist) > distSq(landmarks[10], wrist);
    const ringExt = distSq(landmarks[16], wrist) > distSq(landmarks[14], wrist);

    return dPinky < 0.35 && indexExt && midExt && ringExt;
}

export function detectNamaste(landmarksList: NormalizedLandmark[][]): boolean {
    if (landmarksList.length < 2) return false;

    const h1Wrist = landmarksList[0][0];
    const h2Wrist = landmarksList[1][0];

    const d = dist(h1Wrist, h2Wrist);
    return d < 0.20;
}

export function detectDhyanaMudra(landmarksList: NormalizedLandmark[][]): boolean {
    if (landmarksList.length < 2) return false;
    // Hands on lap, one over other.
    // Wrists close.
    const h1Wrist = landmarksList[0][0];
    const h2Wrist = landmarksList[1][0];

    // Thumbs touching
    const h1Thumb = landmarksList[0][4];
    const h2Thumb = landmarksList[1][4];

    return dist(h1Wrist, h2Wrist) < 0.35 && dist(h1Thumb, h2Thumb) < 0.15;
}

export function detectHakiniMudra(landmarksList: NormalizedLandmark[][]): boolean {
    if (landmarksList.length < 2) return false;
    // All fingertips touching.
    const h1 = landmarksList[0];
    const h2 = landmarksList[1];

    const dThumb = dist(h1[4], h2[4]);
    const dIndex = dist(h1[8], h2[8]);
    const dMid = dist(h1[12], h2[12]);
    const dRing = dist(h1[16], h2[16]);
    const dPinky = dist(h1[20], h2[20]);

    // Threshold
    const T = 0.10;
    return dThumb < T && dIndex < T && dMid < T && dRing < T && dPinky < T;
}

export function detectGaneshaMudra(landmarksList: NormalizedLandmark[][]): boolean {
    if (landmarksList.length < 2) return false;
    // Hands clasped close to heart.
    // Wrists close.
    const h1Wrist = landmarksList[0][0];
    const h2Wrist = landmarksList[1][0];

    // Check if fingers are curled (gripping).
    // Hard to detect exactly "Clasp".
    // Heuristic: Wrists close (< 0.25) AND fingers curled.

    // Actually Ganesha is hands pulling apart.
    // If just "Close fists", we can use that.
    return dist(h1Wrist, h2Wrist) < 0.25;
}

export function detectKaliMudra(landmarksList: NormalizedLandmark[][]): boolean {
    if (landmarksList.length < 2) return false;
    const h1 = landmarksList[0];
    const h2 = landmarksList[1];

    // Index fingers extended and touching/close
    const h1Index = h1[8];
    const h2Index = h2[8];
    const indexTouching = dist(h1Index, h2Index) < 0.15;

    // Check extension
    const wrist1 = h1[0];
    const wrist2 = h2[0];
    const h1Ext = distSq(h1Index, wrist1) > distSq(h1[6], wrist1);
    const h2Ext = distSq(h2Index, wrist2) > distSq(h2[6], wrist2);

    return indexTouching && h1Ext && h2Ext;
}

export function classifyTwoHandGesture(landmarksList: NormalizedLandmark[][]): string | null {
    if (detectNamaste(landmarksList)) return "Namaste";
    if (detectHakiniMudra(landmarksList)) return "Hakini Mudra";
    if (detectKaliMudra(landmarksList)) return "Kali Mudra";
    if (detectDhyanaMudra(landmarksList)) return "Dhyana Mudra";
    if (detectGaneshaMudra(landmarksList)) return "Ganesha Mudra";
    return null;
}

export function classifyGesture(landmarks: NormalizedLandmark[]): string | null {
    if (detectGyanMudra(landmarks)) return "Gyan Mudra";
    if (detectChinMudra(landmarks)) return "Chin Mudra";
    if (detectPranaMudra(landmarks)) return "Prana Mudra";
    if (detectApanaMudra(landmarks)) return "Apana Mudra";
    if (detectSuryaMudra(landmarks)) return "Surya Mudra";
    if (detectVarunMudra(landmarks)) return "Varun Mudra";
    if (detectVayuMudra(landmarks)) return "Vayu Mudra";
    if (detectShunyaMudra(landmarks)) return "Shunya Mudra";
    if (detectPrithviMudra(landmarks)) return "Prithvi Mudra";
    if (detectAdiMudra(landmarks)) return "Adi Mudra";
    if (detectAbhayaMudra(landmarks)) return "Abhaya Mudra";
    return null;
}
