import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register plugins
gsap.registerPlugin(SplitText);

// Hide Loader for now
gsap.set('.loader', {
  autoAlpha: 0,
});

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();


/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// Load Textures
const particleTexture = textureLoader.load('/textures/particles/9.png');
const planetTexture = textureLoader.load('/textures/2k_moon.jpg');

// Animate loader on load
loadingManager.onLoad = () => {
  let loaderTL = gsap.timeline();
  loaderTL
    .to('.loader h2', {
      autoAlpha: 0,
      duration: 1,
      delay: 1,
    })
    .to('.loader span', {
      autoAlpha: 0,
      delay: 3,
    })
    .to('.loader', {
      yPercent: -100,
      delay: 1,
      duration: 1,
      ease: 'power4.in',
    });
};

/* Particles */
// Geometry
const particleGeometry = new THREE.BufferGeometry();
const count = 10000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 15;
  colors[i] = Math.random();
}

particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.07;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color(0xffffff);
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
// particlesMaterial.vertexColors = true;

gui.addColor(particlesMaterial, 'color').name('particleColor');

// points
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshBasicMaterial({
    wireframe: true,
    map: planetTexture,
  })
);

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

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

  // Animate particles
  particles.rotation.y = elapsedTime * 0.02;

  // for (let i = 0; i < count; i++) {
  //   const i3 = i * 3;
  //   const x = particleGeometry.attributes.position.array[i3 + 0];
  //   particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  // }
  // particleGeometry.attributes.position.needsUpdate = true
  // animate planet
  sphere.rotation.y = -elapsedTime * 0.1;
  sphere.rotation.x = -elapsedTime * 0.1;


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Timelines
let rotateTL = gsap.timeline({
  paused: true,
});
const splitText = new SplitText('.drag-helper span', {
  type: 'chars',
});
let chars = splitText.chars;
rotateTL
  .to('.drag-helper i', {
    rotate: '90deg',
  })
  .to(
    chars,
    {
      yPercent: 100,
      autoAlpha: 0,
      stagger: 0.05,
    },
    '<'
  )
  .to(
    '.drag-helper',
    {
      autoAlpha: 0,
    },
    '<'
  );
window.document.body.addEventListener('mousedown', () => {
  rotateTL.play();
});
window.document.body.addEventListener('mouseup', () => {
  rotateTL.reverse();
});
