import * as THREE from 'three';

import { useEffect, useRef } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function MyThree() {
    const refContainer = useRef(null);


    useEffect(() => {


        // === THREE.JS CODE START ===
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);


        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight()
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);


        scene.add(cube);
        scene.add(light)
        camera.position.z = 5;
        // Add GLTFLoader to load the .glb model
        const loader = new GLTFLoader();
        loader.load('/models/house.glb', (gltf) => {
            console.log(gltf, 'asd');

            const model = gltf.scene;
            scene.add(model);

            // Optional: Adjust the model’s position or scale
            model.position.set(0, 0, 0);
            model.scale.set(1, 1, 1);



            // Initialize OrbitControls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            controls.dampingFactor = 0.25;
            controls.enableZoom = true; // Allow zooming
            controls.enablePan = true; // Allow panning
            controls.enableRotate = true; // Allow rotating

            // Start rendering the scene with the model
            const animate = () => {
                requestAnimationFrame(animate);

                // If you want to rotate the model
                // model.rotation.x += 0.01;
                // model.rotation.y += 0.01;

                renderer.render(scene, camera);
            };
            animate();
        }, undefined, (error) => {
            console.error('An error occurred while loading the model', error);
        });

        // Cleanup
        return () => {
            refContainer.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={refContainer}></div>

    );
}

export default MyThree