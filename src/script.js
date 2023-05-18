import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Debug UI
const gui = new GUI();
// Textures
const loader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = loader.load('/textures/door/color.jpg');
const doorAlphaTexture = loader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = loader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = loader.load('/textures/door/height.jpg');
const doorNormalTexture = loader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = loader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = loader.load('/textures/door/roughness.jpg');

const matcapTexture = loader.load('/matcaps/fiery.png');
const gradientTexture = loader.load('/gradients/5.jpg');
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const moonColorTexture = loader.load('/textures/concreteMuddy/BaseColor.jpg');
const moonAmbientOcclusionTexture = loader.load(
  '/textures/concreteMuddy/AmbientOcclusion.jpg'
);
const moonHeightTexture = loader.load('/textures/concreteMuddy/Height.png');
const moonNormalTexture = loader.load('/textures/concreteMuddy/Normal.jpg');
const moonRoughnessTexture = loader.load(
  '/textures/concreteMuddy/Roughness.jpg'
);

// Scifi pipes
const pipeColorTexture = loader.load('/textures/scifi_pipes/basecolor.jpg');
const pipeAmbientOcclusionTexture = loader.load('/textures/scifi_pipes/ambientOcclusion.jpg');
const pipeHeightTexture = loader.load('/textures/scifi_pipes/height.png');
const pipeMetallicTexture = loader.load('/textures/scifi_pipes/metallic.jpg');
const pipeNormalTexture = loader.load('/textures/scifi_pipes/normal.jpg');
const pipeRoughnessTexture = loader.load('/textures/scifi_pipes/roughness.jpg');

// Environment map
const envMapTexture = cubeTextureLoader.load([
  '/environmentMaps/0/px.jpg',
  '/environmentMaps/0/nx.jpg',
  '/environmentMaps/0/py.jpg',
  '/environmentMaps/0/ny.jpg',
  '/environmentMaps/0/pz.jpg',
  '/environmentMaps/0/nz.jpg',
])

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

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;

// material.map = pipeColorTexture;
// material.aoMap = pipeAmbientOcclusionTexture;
// material.displacementMap = pipeHeightTexture;
// material.metalnessMap = pipeMetallicTexture;
// material.roughnessMap = pipeRoughnessTexture;
// material.normalMap = pipeNormalTexture

// material.displacementScale = 0.1;
// material.normalScale.set(0.5, 0.5)

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = envMapTexture;


gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(1.5).step(0.1)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

// Geometry
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 124);

const sphere = new THREE.Mesh(sphereGeometry, material);

sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(planeGeometry, material);
const cube = new THREE.Mesh(cubeGeometry, material);

plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(torusGeometry, material);
torus.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);


sphere.position.x = -1.5;
cube.position.x = 1.5;

scene.add(
  sphere,
  plane,
  // torus,
  cube
  );

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
gui.add(pointLight.position, 'x').min(-10).max(10).step(1).name('pointLightX');
gui.add(pointLight.position, 'y').min(-10).max(10).step(1).name('pointLightY');
gui.add(pointLight.position, 'z').min(-10).max(10).step(1).name('pointLightZ');

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
