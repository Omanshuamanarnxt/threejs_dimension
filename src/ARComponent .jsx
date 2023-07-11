import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

const ARComponent = () => {
  const containerRef = useRef();

  useEffect(() => {
    let renderer, camera, scene, cube;

    const init = () => {
      // Create a three.js scene
      scene = new THREE.Scene();

      // Create a three.js camera
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );
      camera.position.set(0, 1.6, 3);

      // Create a three.js renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      containerRef.current.appendChild(renderer.domElement);

      // Add AR button to enter AR mode
      document.body.appendChild(ARButton.createButton(renderer));

      // Add a plane to the scene
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(plane);

      // Add a cube to the scene
      const cubeGeometry = new THREE.BoxGeometry();
      const cubeMaterial = new THREE.MeshNormalMaterial();
      cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      scene.add(cube);

      // Position the cube on top of the plane
      cube.position.set(0, 0.5, 0);

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
    };

    init();
  }, []);

  return <div ref={containerRef}></div>;
};

export default ARComponent;
