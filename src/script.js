import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { gsap } from 'gsap';

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
// const texture = textureLoader.load('/textures/scifi_metal/normal.jpg');

const colorTexture = textureLoader.load('/textures/scifi_metal/base.jpg');
const alphaTexture = textureLoader.load('/textures/scifi_metal/opacity.jpg');
const heightTexture = textureLoader.load('/textures/scifi_metal/height.png');
const normalTexture = textureLoader.load('/textures/scifi_metal/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/textures/scifi_metal/ambientOcclusion.jpg'
);
const metalnessTexture = textureLoader.load(
  '/textures/scifi_metal/metallic.jpg'
);
const roughnessTexture = textureLoader.load(
  '/textures/scifi_metal/roughness.jpg'
);

// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// colorTexture.center.y = 0.5
// colorTexture.center.x = 0.5

// colorTexture.rotation = Math.PI / 4
// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.magFilter = THREE.NearestFilter;

loadingManager.onLoad = () => {
  gsap.to('.loader', {
    autoAlpha: 0,
    duration: 1,
    delay: 1,
  });
};

/**
 *
 * Debug
 *
 **/
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Scene Settings
scene.background = new THREE.Color('#000008');

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('boxElevation');

gui.add(colorTexture.repeat, 'x')
  .min(1)
  .max(6)
  .step(1)
  .name('textureRepeatX')

gui.add(colorTexture.repeat, 'y')
  .min(1)
  .max(6)
  .step(1)
  .name('textureRepeatY')

gui.add(material, 'wireframe')
  .name('enableWireframe')
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
camera.position.z = 1;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
