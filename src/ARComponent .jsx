import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

const ARComponent = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Create a three.js scene
    const scene = new THREE.Scene();

    // Create a three.js camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
    camera.position.set(0, 1.6, 3);

    // Create a three.js renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Add AR button to enter AR mode
    document.body.appendChild(ARButton.createButton(renderer));

    // Add a cube to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Render loop
    const animate = () => {
      renderer.setAnimationLoop(() => {
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      });
    };

    // Clean up on unmount
    return () => {
      renderer.setAnimationLoop(null);
      document.body.removeChild(renderer.domElement);
    };

    // Start rendering
    animate();
  }, []);

  return <div ref={containerRef}></div>;
};

export default ARComponent;
