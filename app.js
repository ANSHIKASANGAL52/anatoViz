import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// DOM Elements
const heartBtn = document.getElementById('heart-btn');
const modelContainer = document.getElementById('model-container');
const closeBtn = document.getElementById('close-btn');

// Scene setup
let renderer, scene, camera, controls;

// Function to initialize Three.js scene
function init3DScene() {
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  modelContainer.appendChild(renderer.domElement);

  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1e1e1e);

  // Create camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 3);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1, 0);
  controls.update();
}

// Function to load the heart model
function loadHeartModel() {
  const loader = new GLTFLoader();
  loader.load(
    '.realistic_human_heart/scene.gltf', // Path to the heart model
    (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      model.scale.set(0.01, 0.01, 0.01); // Adjust scale if necessary
      scene.add(model);
      console.log('Heart model loaded');
    },
    (xhr) => {
      console.log(Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%);
    },
    (error) => {
      console.error('Error loading model:', error);
    }
  );
}

// Function to animate the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Event Listeners
heartBtn.addEventListener('click', () => {
  modelContainer.style.display = 'block'; // Show 3D model container
  if (!scene) {
    init3DScene();
    loadHeartModel();
    animate();
  }
});

closeBtn.addEventListener('click', () => {
  modelContainer.style.display = 'none'; // Hide the model container
});

// Handle window resizing
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

