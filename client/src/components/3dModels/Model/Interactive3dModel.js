import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls"; // Import OrbitControls
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

function Interactive3DModel({ width = "700px", height = "300px", modelurl }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    const pixelRatio = window.devicePixelRatio || 2;
    renderer.setPixelRatio(pixelRatio);

    // Position axes helper at the bottom of the view
    const axesHelper = new THREE.AxesHelper(3);
    axesHelper.position.y = -4; // Adjust the value as needed to position it at the bottom
    scene.add(axesHelper);

    // Load the 3D model 
    const objLoader = new OBJLoader();
    objLoader.load(modelurl, (obj) => {
      console.log(obj);

      if (obj) {
        if (obj instanceof THREE.Object3D) {
          const model = obj.type === "Group" ? obj.children : [obj];

          model.forEach((child, index) => {
            if (child instanceof THREE.Object3D) {
              // Apply a material with transparency
              const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random()),
                transparent: true,
                opacity: 0.5 // Adjust the opacity as needed
              });

              if (child instanceof THREE.Mesh) {
                child.material = material;
              }

              // Position the model at the same level as the axes helper
              child.position.y = -4; // Adjust the value as needed
              scene.add(child);
            } else {
              console.error("Invalid model structure!");
            }
          });

          console.log("Scene added successfully");
        } else {
          console.error("Invalid model structure!");
        }
      } else {
        console.error("Error loading model!");
      }
    });

    camera.position.z = 10;
    camera.position.y = 5;

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Add OrbitControls for rotation and panning
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls before rendering
      renderer.render(scene, camera);
    };

    animate();
  }, []); // Re-render if modelPath or fieldOfView changes

  return (
    <canvas ref={canvasRef} style={{ width, height }} /> // Set desired width and height
  );
}

export default Interactive3DModel;
