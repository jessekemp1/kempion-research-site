// @ts-nocheck
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 8000; // Increased density for better void definition
const PARTICLE_SIZE = 0.04;
const ANIMATION_SPEED = 0.02; // LERP factor for "Very Smooth"

// Geometries
const CUBE_SIZE = 7.5;
const SPHERE_RADIUS = 4.8;

// Void Dimensions
const INNER_CUBE_SIZE = 3.5;
const INNER_SPHERE_RADIUS = 3.0;

// --- Geometry Generators ---

// 1. Sphere with Cube Void
// Hollow sphere shell? Or solid sphere with cube hole? "Sphere with empty cube at center" -> Solid Sphere with hole.
const getVoidSphere = (count: number) => {
    const positions = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
        // Random point in Sphere
        // Rejection sampling for uniform distribution
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * SPHERE_RADIUS; // Uniform volume

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        // Check if inside Inner Cube
        const halfS = INNER_CUBE_SIZE / 2;
        const insideCube = (Math.abs(x) < halfS && Math.abs(y) < halfS && Math.abs(z) < halfS);

        if (!insideCube) {
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            i++;
        }
    }
    return positions;
};

// 2. Cube with Sphere Void
const getVoidCube = (count: number) => {
    const positions = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
        // Random point in Cube
        const x = (Math.random() - 0.5) * CUBE_SIZE;
        const y = (Math.random() - 0.5) * CUBE_SIZE;
        const z = (Math.random() - 0.5) * CUBE_SIZE;

        // Check if inside Inner Sphere
        const distSq = x * x + y * y + z * z;
        const insideSphere = distSq < (INNER_SPHERE_RADIUS * INNER_SPHERE_RADIUS);

        if (!insideSphere) {
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            i++;
        }
    }
    return positions;
};

const getCloud = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Wide atmospheric distribution
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
};

const VoidParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Data ---
    const { cloudPos, voidSpherePos, voidCubePos, initialPos } = useMemo(() => {
        const c = getCloud(PARTICLE_COUNT);
        const vs = getVoidSphere(PARTICLE_COUNT);
        const vc = getVoidCube(PARTICLE_COUNT);
        // Initial = Cloud
        const init = new Float32Array(c);
        return { cloudPos: c, voidSpherePos: vs, voidCubePos: vc, initialPos: init };
    }, []);

    // --- State ---
    const state = useRef({
        currentPositions: new Float32Array(initialPos), // Where we are right now
        targetPositions: cloudPos, // Where we want to go
        phase: 'cloud', // cloud, sphere, cube, melt
        isScrolling: false,
        scrollTimeout: 0 as unknown as ReturnType<typeof setTimeout>,
    });

    // --- Logic & Cycle ---
    useEffect(() => {
        const s = state.current;
        let cycleTimeout: ReturnType<typeof setTimeout>;

        // The Main Animation Loop
        const runCycle = () => {
            // If scrolling, do nothing (paused logic handled elsewhere)
            if (s.isScrolling) return;

            // Logic:
            // 1. Cloud (30s)
            // 2. VoidSphere (10s morph + 5s hold?) -> Let's say 15s total
            // 3. VoidCube (15s)
            // 4. Cloud...

            console.log("Entering Phase:", s.phase);

            if (s.phase === 'cloud') {
                s.targetPositions = cloudPos;
                cycleTimeout = setTimeout(() => {
                    if (s.isScrolling) return;
                    s.phase = 'sphere';
                    runCycle();
                }, 30000); // 30s Cloud
            }
            else if (s.phase === 'sphere') {
                s.targetPositions = voidSpherePos;
                cycleTimeout = setTimeout(() => {
                    if (s.isScrolling) return;
                    s.phase = 'cube';
                    runCycle();
                }, 12000); // 12s to form/hold
            }
            else if (s.phase === 'cube') {
                s.targetPositions = voidCubePos;
                cycleTimeout = setTimeout(() => {
                    if (s.isScrolling) return;
                    s.phase = 'cloud';
                    runCycle();
                }, 12000); // 12s to form/hold
            }
            else if (s.phase === 'melt') {
                // Should not happen via this loop, but if it does, go to cloud
                s.phase = 'cloud';
                runCycle();
            }
        };

        // Initial Start
        runCycle();

        // --- Scroll Listener ---
        const handleScroll = () => {
            s.isScrolling = true;
            s.phase = 'melt'; // Override phase

            // "Melt" Target calculation handled in useFrame (dynamic) or just Cloud?
            // "Melt down" implication -> y moves down?
            // For now, let's target CLOUD but maybe with a downward offset in the loop?
            // Or just 'cloudPos' is the melt state.
            s.targetPositions = cloudPos;

            // Clear existing cycle timer so we don't jump mid-scroll
            clearTimeout(cycleTimeout);
            clearTimeout(s.scrollTimeout);

            // Debounce Stop
            s.scrollTimeout = setTimeout(() => {
                s.isScrolling = false;
                // Restart Loop
                // Go back to Cloud start? Or resume? 
                // "Restart loop when user stops" -> Cloud
                s.phase = 'cloud';
                runCycle();
            }, 300);
        };

        window.addEventListener('scroll', handleScroll);
        // Also listen to 'wheel' just in case
        window.addEventListener('wheel', handleScroll);

        return () => {
            clearTimeout(cycleTimeout);
            clearTimeout(s.scrollTimeout);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    // --- Render Loop (LERP) ---
    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const targets = s.targetPositions;

        // Dynamic "Melt" Offset? 
        // If melting, maybe we add strict gravity? 
        // Let's stick to LERP to 'cloudPos' for simplicity first, 
        // but maybe add a random 'fall' factor if Phase is Melt?

        // User said: "melt down... restart when stops"
        // Let's make "Melt" target = positions with Y lowered? 
        // No, keep it simple and elegant. Returning to "Chaotic Cloud" is effectively melting.

        // Speed adjustment
        // If scrolling (melting), fast transition? 
        // If morphing, slow transition?
        const speed = s.isScrolling ? 0.08 : ANIMATION_SPEED; // Fast melt, slow morph

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            // Simple LERP: current + (target - current) * speed
            // Optimized:

            let tx = targets[ix];
            let ty = targets[iy];
            let tz = targets[iz];

            if (s.isScrolling) {
                // Add downward drift to melt effect
                ty -= 2.0;
            }

            positions[ix] += (tx - positions[ix]) * speed;
            positions[iy] += (ty - positions[iy]) * speed;
            positions[iz] += (tz - positions[iz]) * speed;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Rotation
        pointsRef.current.rotation.y += delta * 0.03;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={initialPos.length / 3}
                    array={initialPos}
                    itemSize={3}
                    args={[initialPos, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={PARTICLE_SIZE}
                color="#00aaff"
                sizeAttenuation
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default function AnimationV5_Voids() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #05101a 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 16], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <VoidParticles />
            </Canvas>
        </div>
    );
}
