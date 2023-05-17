import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Textures
const loader = new THREE.TextureLoader();

const doorColorTexture = loader.load('/textures/door/color.jpg');
const doorAlphaTexture = loader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = loader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = loader.load('/textures/door/height.jpg');
const doorNormalTexture = loader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = loader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = loader.load('/textures/door/roughness.jpg');

const matcapTexture = loader.load('/matcaps/1.png');
const gradientTexture = loader.load('/gradients/3.jpg');

const moonColorTexture = loader.load('/textures/concreteMuddy/BaseColor.jpg');
const moonAmbientOcclusionTexture = loader.load(
  '/textures/concreteMuddy/AmbientOcclusion.jpg'
);
const moonHeightTexture = loader.load('/textures/concreteMuddy/Height.png');
const moonNormalTexture = loader.load('/textures/concreteMuddy/Normal.jpg');
const moonRoughnessTexture = loader.load(
  '/textures/concreteMuddy/Roughness.jpg'
);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000008);

// Material
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0x000008);
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial()
// material.normalMap = moonNormalTexture;
// material.flatShading = true

const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

// Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

// sphere.position.x = -1.5;
// torus.position.x = 1.5;

scene.add(sphere);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
