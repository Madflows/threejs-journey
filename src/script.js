import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; //for loading font from web server
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; //for text display in scene, with animation and
import * as dat from 'lil-gui';
import { gsap } from 'gsap';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
  // console.log(cursor);
});

// Data
const data = {
  text: 'Folarin Lawal\nCreative Developer',
};

let textPosition;

gui.add(data, 'text');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x292929);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load('/textures/matcaps/3.png');

// Fonts
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry(data.text, {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  // textGeometry.computeBoundingBox();

  // // Center the text geometry
  // textGeometry.translate(
  //   - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
  // )

  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  // const material = new THREE.MeshNormalMaterial();
  const text = new THREE.Mesh(textGeometry, material);

  textPosition = text.position;

  scene.add(text);
  camera.lookAt(text.position);
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

  for (let i = 0; i < 150; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    const cube = new THREE.Mesh(cubeGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;

    // Random scale
    const donutScale = Math.random();
    donut.scale.set(donutScale, donutScale, donutScale);

    const cubeScale = Math.random();
    cube.scale.set(cubeScale, cubeScale, cubeScale);

    scene.add(donut, cube);
  }
});

/**
 * Object
 */

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
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// window.addEventListener('mousemove', (e) => {
//   controls.handleMouseMoveRotate(e);
// });

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

let sceneTL = gsap.timeline();

sceneTL
  .from(camera.position, {
    z: 500,
    duration: 2,
  })
  .from(
    scene.rotation,
    {
      x: -Math.PI * 2,
    },
    '<'
  );

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Camera
  // camera.position.x = Math.sin(cursor.x * Math.PI);
  // camera.position.z = Math.cos(cursor.x * Math.PI) * 2;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
