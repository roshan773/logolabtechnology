// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3dCanvas'), antialias: true });
renderer.setClearColor(0x002142); // Match the background color

// Create a torus knot geometry with a bigger size
const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0xF3CC30,
    emissive: 0xF3CC30,
    emissiveIntensity: 0.5
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a point light for reflections
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Add a moving spotlight for dynamic lighting
const spotlight = new THREE.SpotLight(0xffffff, 1);
spotlight.position.set(10, 10, 10);
spotlight.castShadow = true;
scene.add(spotlight);

// Position the camera
camera.position.z = 5;

// Mouse movement for interaction
window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    torusKnot.rotation.y = x * Math.PI; // Rotate the knot based on mouse X
    torusKnot.rotation.x = y * Math.PI; // Rotate the knot based on mouse Y
});

// Raycaster for detecting hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the torus knot for dynamic effect
    torusKnot.rotation.z += 0.01;

    // Update point light position for dynamic lighting effect
    pointLight.position.x = 5 * Math.sin(Date.now() * 0.001);
    pointLight.position.z = 5 * Math.cos(Date.now() * 0.001);

    // Raycasting to detect hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([torusKnot]);

    if (intersects.length > 0) {
        hoveredObject = torusKnot;
        torusKnot.material.color.set(0xFFD700); // Highlight color
    } else {
        hoveredObject = null;
        torusKnot.material.color.set(0xF3CC30); // Default color
    }

    renderer.render(scene, camera);
}

// Handle window resize for responsiveness
function handleResize() {
    const canvas = renderer.domElement;
    const container = document.querySelector('.image-container');
    const width = container.clientWidth;
    const height = 400; // Fixed height; adjust if needed

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', handleResize);
handleResize(); // Call initially to set the correct size

// Initial call to start the animation
animate();


