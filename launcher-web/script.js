// --- 3D BRAIN VISUALIZATION ---
let scene, camera, renderer, brain;

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const container = document.getElementById('brain-visualizer');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create a abstract "brain" using spheres and line networks
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5
    });

    brain = new THREE.Mesh(geometry, material);
    scene.add(brain);

    // Add points for neural activity
    const pointsGeometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 5;
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    const neuralNetwork = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(neuralNetwork);

    const light = new THREE.PointLight(0x00f0ff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    brain.rotation.y += 0.005;
    brain.rotation.x += 0.002;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const container = document.getElementById('brain-visualizer');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});

// --- API INTERACTION ---
const launchBtn = document.getElementById('launch-btn');
const systemStatus = document.getElementById('system-status');

launchBtn.addEventListener('click', async () => {
    launchBtn.disabled = true;
    launchBtn.innerHTML = "INITIALIZING...";
    systemStatus.innerHTML = "LAUNCHING...";
    systemStatus.style.color = "#00f0ff";

    try {
        const response = await fetch('http://localhost:8000/launch');
        const data = await response.json();

        if (data.status === "success") {
            setTimeout(() => {
                launchBtn.disabled = false;
                launchBtn.innerHTML = "LAUNCH SUCCESS";
                launchBtn.style.color = "#00ff41";
                launchBtn.style.borderColor = "#00ff41";
                systemStatus.innerHTML = "ACTIVE";
                systemStatus.style.color = "#00ff41";
            }, 2000);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Launch Error:", error);
        launchBtn.disabled = false;
        launchBtn.innerHTML = "LAUNCH FAILED";
        launchBtn.style.color = "#ff1744";
        launchBtn.style.borderColor = "#ff1744";
        systemStatus.innerHTML = "ERROR";
        systemStatus.style.color = "#ff1744";
    }
});

// Initialize
initThree();
