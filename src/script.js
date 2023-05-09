import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xcd2546 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Clock
// const clock = new THREE.Clock();

gsap.registerPlugin(ScrollTrigger)

gsap.to(mesh.position, {
    x: 2,
    duration: 1,
    delay: 1,
    
})


// Animations
const tick = () => {



    // const elapsedTime = clock.getElapsedTime();

    // Update objects
    // camera.position.y = Math.cos(elapsedTime); // Rotate object around x axis.
    // camera.position.x = Math.sin(elapsedTime); // Rotate object around x axis.
    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick)
}

tick()
