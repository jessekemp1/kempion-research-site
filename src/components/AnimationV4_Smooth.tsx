import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 6000;
const CUBE_SIZE = 7.0;
const PARTICLE_SIZE = 0.05;

// Physics Constants
const SPRING_STRENGTH = 0.08; // How hard it pulls to target
const DAMPING = 0.92;         // Friction (0.9 = floaty, 0.8 = sluggish)
const MOUSE_FORCE = 1.5;      // Repulsion strength
const MOUSE_RADIUS_SQ = 16.0; // 4.0 ^ 2

const SmoothParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);
    const { pointer, viewport } = useThree();

    // --- 1. Data Generation (Run once) ---
    const { cloudPos, cubePos, initialPos } = useMemo(() => {
        const cPos = new Float32Array(PARTICLE_COUNT * 3); // Cloud targets
        const kPos = new Float32Array(PARTICLE_COUNT * 3); // Cube targets
        const iPos = new Float32Array(PARTICLE_COUNT * 3); // Initial positions

        const side = Math.cbrt(PARTICLE_COUNT);
        const step = CUBE_SIZE / side;
        let i = 0;

        for (let x = 0; x < side; x++) {
            for (let y = 0; y < side; y++) {
                for (let z = 0; z < side; z++) {
                    if (i >= PARTICLE_COUNT) break;

                    // Cube Target
                    kPos[i * 3] = (x - side / 2) * step + (Math.random() - 0.5) * 0.2;
                    kPos[i * 3 + 1] = (y - side / 2) * step + (Math.random() - 0.5) * 0.2;
                    kPos[i * 3 + 2] = (z - side / 2) * step + (Math.random() - 0.5) * 0.2;

                    // Cloud Target (Wide dispersal)
                    cPos[i * 3] = (Math.random() - 0.5) * 40;
                    cPos[i * 3 + 1] = (Math.random() - 0.5) * 20; // Flatter cloud
                    cPos[i * 3 + 2] = (Math.random() - 0.5) * 20;

                    // Start randomly
                    iPos[i * 3] = cPos[i * 3];
                    iPos[i * 3 + 1] = cPos[i * 3 + 1];
                    iPos[i * 3 + 2] = cPos[i * 3 + 2];

                    i++;
                }
            }
        }
        // Fill remainder
        while (i < PARTICLE_COUNT) {
            kPos[i * 3] = (Math.random() - 0.5) * CUBE_SIZE;
            cPos[i * 3] = (Math.random() - 0.5) * 30;
            i++;
        }

        return { cloudPos: cPos, cubePos: kPos, initialPos: iPos };
    }, []);

    // --- 2. Simulation State (Mutable for per-frame speed) ---
    // We use Refs for physics state to avoid React re-renders in the loop
    const state = useRef({
        velocities: new Float32Array(PARTICLE_COUNT * 3), // [vx, vy, vz, ...]
        mixFactor: 0, // 0 = Cloud, 1 = Cube
        targetMix: 0, // Where we want to be
        time: 0,
    });

    // --- 3. Animation Cycle Logic ---
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const loop = () => {
            const s = state.current;

            // Current State Logic:
            // If we are at Cloud (targetMix 0), wait then go to Cube
            // If we are at Cube (targetMix 1), wait then go to Cloud

            if (s.targetMix === 0) {
                // We are targeting Cloud. Wait here, then condense.
                // Cloud Time: 1s wait, then trigger condense
                timeout = setTimeout(() => {
                    s.targetMix = 1; // Go to Cube
                    loop();
                }, 4000); // Stay as cloud for 4s
            } else {
                // We are targeting Cube.
                // Condense & Hold Time: 8s
                timeout = setTimeout(() => {
                    s.targetMix = 0; // Go to Cloud
                    loop();
                }, 10000); // Stay as cube for 10s
            }
        };

        loop();
        return () => clearTimeout(timeout);
    }, []);

    // --- 4. The Physics Loop (Runs 60fps) ---
    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const vels = s.velocities;

        // Smoothly interpolate the global mix factor
        // This makes the transition "start" slowly and accelerate
        // delta * 0.5 means it takes ~2 seconds to fully transition mixFactor
        const mixSpeed = delta * 0.6;
        if (s.mixFactor < s.targetMix) {
            s.mixFactor = Math.min(s.mixFactor + mixSpeed, s.targetMix);
        } else if (s.mixFactor > s.targetMix) {
            s.mixFactor = Math.max(s.mixFactor - mixSpeed, s.targetMix);
        }

        // Mouse World Position Approx (Projecting to z=0 plane)
        const mouseX = (pointer.x * viewport.width) / 2;
        const mouseY = (pointer.y * viewport.height) / 2;

        // Optimized Loop
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            // 1. Calculate Target Position based on Mix
            // mixFactor 0 = Cloud, 1 = Cube
            // We lerp strictly between the two pre-defined targets for this particle.
            // This ensures deterministic, organized movement (not random flying).
            const tx = cloudPos[ix] + (cubePos[ix] - cloudPos[ix]) * s.mixFactor;
            const ty = cloudPos[iy] + (cubePos[iy] - cloudPos[iy]) * s.mixFactor;
            const tz = cloudPos[iz] + (cubePos[iz] - cloudPos[iz]) * s.mixFactor;

            // 2. Spring Physics (Hooke's Law)
            // Force = (Target - Current) * Stiffness
            const fx = (tx - positions[ix]) * SPRING_STRENGTH;
            const fy = (ty - positions[iy]) * SPRING_STRENGTH;
            const fz = (tz - positions[iz]) * SPRING_STRENGTH;

            // 3. Update Velocity + Damping
            vels[ix] += fx;
            vels[iy] += fy;
            vels[iz] += fz;

            // 4. Mouse Repulsion (Force Field)
            // Vector from mouse to particle
            const dx = positions[ix] - mouseX;
            const dy = positions[iy] - mouseY;
            // Roughly check dist sq
            const distSq = dx * dx + dy * dy;

            if (distSq < MOUSE_RADIUS_SQ) {
                const dist = Math.sqrt(distSq);
                // Force increases as you get closer to center
                const force = (4.0 - dist) * MOUSE_FORCE * delta; // 4.0 is sqrt(16)

                // Push away
                vels[ix] += (dx / dist) * force;
                vels[iy] += (dy / dist) * force;
            }

            // Apply Damping
            vels[ix] *= DAMPING;
            vels[iy] *= DAMPING;
            vels[iz] *= DAMPING;

            // 5. Update Position
            positions[ix] += vels[ix];
            positions[iy] += vels[iy];
            positions[iz] += vels[iz];
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Slow Rotation
        pointsRef.current.rotation.y += delta * 0.05;
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
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default function AnimationV4_Smooth() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #0a1a2a 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 14], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <SmoothParticles />
            </Canvas>
        </div>
    );
}
