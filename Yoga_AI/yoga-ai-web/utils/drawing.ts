import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export const CHAKRA_COLORS = [
    "rgb(255, 0, 0)", // Root - Red
    "rgb(255, 140, 0)", // Sacral - Orange
    "rgb(255, 255, 0)", // Solar - Yellow
    "rgb(0, 255, 0)", // Heart - Green
    "rgb(0, 0, 255)", // Throat - Blue
    "rgb(255, 0, 255)", // Third Eye - Violet
    "rgb(255, 255, 255)", // Crown - White
];

export const CHAKRA_NAMES = [
    "Root",
    "Sacral",
    "Solar Plexus",
    "Heart",
    "Throat",
    "Third Eye",
    "Crown",
];

export function drawUniverse(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number,
    speedFactor: number = 1.0
) {
    const cx = width * 0.15;
    const cy = height * 0.5;

    // --- Premium Nebula Effect ---
    ctx.save();
    const nebulaGradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
    nebulaGradient.addColorStop(0, "rgba(80, 0, 120, 0.3)");  // Deep Purple
    nebulaGradient.addColorStop(0.5, "rgba(40, 0, 60, 0.15)"); // Dark Indigo
    nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");        // Fade out

    ctx.fillStyle = nebulaGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // --- Center Star (Glow) ---
    ctx.save();
    ctx.shadowBlur = 40;
    ctx.shadowColor = "rgba(255, 255, 0, 0.8)";
    const starGradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30);
    starGradient.addColorStop(0, "white");
    starGradient.addColorStop(0.4, "yellow");
    starGradient.addColorStop(1, "rgba(255, 255, 0, 0)");

    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = starGradient;
    ctx.fill();
    ctx.restore();

    const orbitRadii = [55, 90, 125];
    const speeds = [0.9, 0.6, 0.35];
    const planetColors = ["#00f2ff", "#ffffff", "#ffcc00"];

    orbitRadii.forEach((r, i) => {
        const angle = t * speeds[i] * speedFactor;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);

        // Planet with Glow
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = planetColors[i];

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 2 * Math.PI); // Smaller, more precise planets
        ctx.fillStyle = planetColors[i];
        ctx.fill();

        // Inner white core
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        // Orbit path (Subtle Neon)
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

export function drawChakras(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    topY: number,
    bottomY: number,
    activeIndex: number,
    energies: number[],
    breathFactor: number,
    t: number
) {
    const numChakras = 7;
    const ys = [];
    for (let i = 0; i < numChakras; i++) {
        ys.push(bottomY + (i * (topY - bottomY)) / (numChakras - 1));
    }

    const musicPulse = 0.8 + 0.35 * Math.sin(2.0 * t);

    for (let i = 0; i < numChakras; i++) {
        const energy = energies[i];
        const wobble = 8 * Math.sin(t * 1.4 + i * 0.9);
        const cy = ys[i] + wobble;
        const baseRadius = 16 + energy * 20;
        const radius = baseRadius * breathFactor * musicPulse;

        // --- Glowing Orb Look ---
        ctx.save();
        const chakraColor = CHAKRA_COLORS[i];

        // Dynamic Outer Glow
        ctx.shadowBlur = 20 * energy * musicPulse;
        ctx.shadowColor = chakraColor;

        const orbGradient = ctx.createRadialGradient(centerX, cy, 2, centerX, cy, radius);
        orbGradient.addColorStop(0, "white");
        orbGradient.addColorStop(0.3, chakraColor);
        orbGradient.addColorStop(1, chakraColor.replace("rgb", "rgba").replace(")", ", 0.4)"));

        ctx.beginPath();
        ctx.arc(centerX, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = orbGradient;
        ctx.fill();

        // Energy Ripple (Pulsing ring)
        if (energy > 0.1) {
            const rippleRadius = radius * (1.1 + 0.4 * Math.sin(t * 5 + i));
            ctx.beginPath();
            ctx.arc(centerX, cy, rippleRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = chakraColor.replace("rgb", "rgba").replace(")", ", 0.2)");
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();

        // Orbiting Electron Dot
        const orbitR = radius * 1.6;
        const dotAngle = t * 3.0 + i;
        const dotX = centerX + orbitR * Math.cos(dotAngle);
        const dotY = cy + orbitR * Math.sin(dotAngle);

        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fill();
    }
}

export function drawRevolvingAura(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    t: number,
    intensity: number = 1.0
) {
    const goldenColor = `rgba(255, 215, 0, ${0.2 * intensity})`; // Gold with variable alpha
    const particleColor = `rgba(255, 215, 0, ${1.0 * intensity})`;

    // Draw main glowing halo
    ctx.save();
    // ctx.globalAlpha = 0.2; // Already handled by color alpha
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = goldenColor;
    ctx.fill();
    ctx.restore();

    // Revolving particles
    const numParticles = 8;
    for (let i = 0; i < numParticles; i++) {
        const angle = t * 2.0 + i * ((2 * Math.PI) / numParticles);
        const orbitRx = radius * 1.2;
        const orbitRy = radius * 0.4;

        const px = centerX + orbitRx * Math.cos(angle);
        const py = centerY + orbitRy * Math.sin(angle) - radius * 0.5;

        // White core
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
        ctx.fill();

        // Golden rim
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = particleColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export function drawSmartTracking(
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    width: number,
    height: number
) {
    // Draw connections (simplified)
    // We need the connection pairs. MediaPipe Hands has HAND_CONNECTIONS.
    // I'll define a simple subset or import from mediapipe if possible, but hardcoding is safer for now.
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
    ];

    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.lineWidth = 2;

    for (const [start, end] of connections) {
        const p1 = landmarks[start];
        const p2 = landmarks[end];
        ctx.beginPath();
        // Mirror x-coordinates to match flipped video
        ctx.moveTo((1 - p1.x) * width, p1.y * height);
        ctx.lineTo((1 - p2.x) * width, p2.y * height);
        ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = "rgb(0, 255, 0)";
    for (const lm of landmarks) {
        ctx.beginPath();
        // Mirror x-coordinates to match flipped video
        ctx.arc((1 - lm.x) * width, lm.y * height, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}
