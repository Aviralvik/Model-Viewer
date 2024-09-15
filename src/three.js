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
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 2.3;
        renderer.shadowMap.enabled = true;
        // scene.background.addColors(0xfffff);
        scene.background = new THREE.Color(0xffffff); // White color


        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        const hemilight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
        scene.add(hemilight)

        const spotLight = new THREE.SpotLight(0xffa95c, 4)
        spotLight.castShadow = true;
        scene.add(spotLight)

        camera.position.z = 5;


        // Add GLTFLoader to load the .glb model
        const loader = new GLTFLoader();
        loader.load('/models/house02.glb', (gltf) => {

            const model = gltf.scene.children[0];
            model.castShadow = true;
            model.receiveShadow = true;
            model.traverse(n => {
                if (n.isMesh) {
                    n.castShadow = true;
                    n.receiveShadow = true;
                }
            })
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
                renderer.render(scene, camera);
                spotLight.position.set(
                    camera.position.x + 10,
                    camera.position.y + 10,
                    camera.position.z + 10
                )

                requestAnimationFrame(animate);
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