// @ts-nocheck
/**
 * AnimationV10_SmoothCycle
 *
 * Version 8 (marked for reference)
 *
 * Features:
 * - 35,000 particles
 * - 51 second automatic cycle
 * - Cloud (4s) → Sphere (3s transition + 7s hold) → Cube (4s transition + 7s hold)
 * - Sphere ⟷ Cube oscillation (twice, 4s transitions + 7s holds each)
 * - Back to Cloud (4s transition)
 * - Larger sphere (6.0) and cube (9.0)
 * - Smoother entrance with gentle spiral rotation
 * - Flow particles towards viewer during cloud phase (25% boost)
 * - Brighter particles (#33ccff base, #ffffff accents)
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 35000;
const ANIMATION_SPEED = 0.008;

// Geometries
const CUBE_SIZE = 9.0;
const SPHERE_RADIUS = 6.0;

// Void Dimensions
const INNER_CUBE_SIZE = 3.5;
const INNER_SPHERE_RADIUS = 3.0;

// Event Horizon Dimensions
const EH_INNER_RADIUS = 2.5;
const EH_OUTER_RADIUS = 9.0;

// Black Hole Dimensions
const BH_SINGULARITY_RADIUS = 0.3;
const BH_ACCRETION_INNER = 1.5;
const BH_ACCRETION_OUTER = 7.0;

// --- Geometry Generators ---

const getVoidSphere = (count: number) => {
    const positions = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * SPHERE_RADIUS;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

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

const getEventHorizon = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Uniform distribution area
        const r = Math.sqrt(Math.random()) * (EH_OUTER_RADIUS - EH_INNER_RADIUS) + EH_INNER_RADIUS;
        const theta = Math.random() * Math.PI * 2;

        // Very thin disk
        const y = (Math.random() - 0.5) * 0.2;

        positions[i * 3] = r * Math.cos(theta);
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = r * Math.sin(theta);
    }
    return positions;
};

const getCloud = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
};

const getFlowPast = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Wide X/Y similar to cloud
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;

        // Z Axis: heavily distributed towards/past camera (Camera Z=18)
        // Range: 15 to 60
        positions[i * 3 + 2] = 15 + Math.random() * 45;
    }
    return positions;
};

const getBlackHole = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const isInSingularity = Math.random() < 0.05; // 5% in core

        if (isInSingularity) {
            // Dense singularity core
            const r = Math.pow(Math.random(), 3) * BH_SINGULARITY_RADIUS;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        } else {
            // Accretion disk with spiral
            const r = Math.sqrt(Math.random()) * (BH_ACCRETION_OUTER - BH_ACCRETION_INNER) + BH_ACCRETION_INNER;
            const theta = Math.random() * Math.PI * 2;

            // Spiral inward (logarithmic spiral)
            const spiralTightness = 0.3;
            const spiralAngle = theta + (BH_ACCRETION_OUTER - r) * spiralTightness;

            // Very thin disk with slight warp
            const y = (Math.random() - 0.5) * 0.15 * (r / BH_ACCRETION_OUTER);

            positions[i * 3] = r * Math.cos(spiralAngle);
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = r * Math.sin(spiralAngle);
        }
    }
    return positions;
};


const BiologicalParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Data ---
    const { cloudPos, voidSpherePos, flowPos, eventHorizonPos, blackHolePos, initialPos, colors, sizes } = useMemo(() => {
        const c = getCloud(PARTICLE_COUNT);
        const vs = getVoidSphere(PARTICLE_COUNT);
        const flow = getFlowPast(PARTICLE_COUNT);
        const eh = getEventHorizon(PARTICLE_COUNT);
        const bh = getBlackHole(PARTICLE_COUNT);
        const init = new Float32Array(c);

        // Colors & Sizes
        const cols = new Float32Array(PARTICLE_COUNT * 3);
        const sz = new Float32Array(PARTICLE_COUNT);
        const color1 = new THREE.Color("#33ccff"); // Brighter Blue
        const color2 = new THREE.Color("#ffffff"); // Pure White

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // 20% Bright/Hot particles
            const isBright = Math.random() > 0.80;
            const col = isBright ? color2 : color1;

            cols[i * 3] = col.r;
            cols[i * 3 + 1] = col.g;
            cols[i * 3 + 2] = col.b;

            // Bright ones are slightly larger
            sz[i] = isBright ? (0.05 + Math.random() * 0.04) : (0.03 + Math.random() * 0.02);
        }

        return { cloudPos: c, voidSpherePos: vs, flowPos: flow, eventHorizonPos: eh, blackHolePos: bh, initialPos: init, colors: cols, sizes: sz };
    }, []);

    // --- State ---
    // No state needed - fully automatic cycle

    // --- Render Loop ---
    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const time = clock.getElapsedTime();

        // Cycle timing (51 second loop):
        // 0-4s: Cloud (hold, 4s, rotating towards viewer)
        // 4-7s: Cloud → Sphere (transition, 3s)
        // 7-14s: Sphere (hold, rotating, 7s)
        // 14-18s: Sphere → Cube (transition, 4s)
        // 18-25s: Cube (hold, rotating, 7s)
        // 25-29s: Cube → Sphere (transition, 4s, first oscillation)
        // 29-36s: Sphere (hold, rotating, 7s)
        // 36-40s: Sphere → Cube (transition, 4s, second oscillation)
        // 40-47s: Cube (hold, rotating, 7s)
        // 47-51s: Cube → Cloud (transition, 4s)
        // Then restart

        const cycle = time % 51;
        let phase1Weight = 0, phase2Weight = 0, phase3Weight = 0; // cloud, sphere, cube

        if (cycle < 4) {
            // Cloud hold (4s)
            phase1Weight = 1;
            phase2Weight = 0;
            phase3Weight = 0;
        } else if (cycle < 7) {
            // Cloud → Sphere transition (3s)
            const t = (cycle - 4) / 3;
            const eased = t * t * (3 - 2 * t); // Smoothstep
            phase1Weight = 1 - eased;
            phase2Weight = eased;
            phase3Weight = 0;
        } else if (cycle < 14) {
            // Sphere hold (7s)
            phase1Weight = 0;
            phase2Weight = 1;
            phase3Weight = 0;
        } else if (cycle < 18) {
            // Sphere → Cube transition (4s)
            const t = (cycle - 14) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = 0;
            phase2Weight = 1 - eased;
            phase3Weight = eased;
        } else if (cycle < 25) {
            // Cube hold (7s)
            phase1Weight = 0;
            phase2Weight = 0;
            phase3Weight = 1;
        } else if (cycle < 29) {
            // Cube → Sphere transition (4s, first oscillation)
            const t = (cycle - 25) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = 0;
            phase2Weight = eased;
            phase3Weight = 1 - eased;
        } else if (cycle < 36) {
            // Sphere hold (7s)
            phase1Weight = 0;
            phase2Weight = 1;
            phase3Weight = 0;
        } else if (cycle < 40) {
            // Sphere → Cube transition (4s, second oscillation)
            const t = (cycle - 36) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = 0;
            phase2Weight = 1 - eased;
            phase3Weight = eased;
        } else if (cycle < 47) {
            // Cube hold (7s)
            phase1Weight = 0;
            phase2Weight = 0;
            phase3Weight = 1;
        } else {
            // Cube → Cloud transition (4s)
            const t = (cycle - 47) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = eased;
            phase2Weight = 0;
            phase3Weight = 1 - eased;
        }

        // Global rotation (faster for more energy)
        pointsRef.current.rotation.y = time * 0.08;
        pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;

        // Generate cube positions on the fly (using CUBE_SIZE)
        const side = Math.cbrt(PARTICLE_COUNT);
        const step = CUBE_SIZE / side;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            // Cloud target (from cloudPos with flow effect)
            // Add forward flow during cloud phase (25% boost to flow effect)
            const flowInfluence = phase1Weight * 1.25;
            const cloudX = cloudPos[ix] + (flowPos[ix] - cloudPos[ix]) * flowInfluence * 0.3;
            const cloudY = cloudPos[iy] + (flowPos[iy] - cloudPos[iy]) * flowInfluence * 0.3;
            const cloudZ = cloudPos[iz] + (flowPos[iz] - cloudPos[iz]) * flowInfluence * 0.3 + (time * 0.5 * flowInfluence);

            // Sphere target (from voidSpherePos)
            const sphereX = voidSpherePos[ix];
            const sphereY = voidSpherePos[iy];
            const sphereZ = voidSpherePos[iz];

            // Cube target (generate on the fly)
            const cubeIndex = i % Math.floor(PARTICLE_COUNT);
            const x = Math.floor(cubeIndex % side);
            const y = Math.floor((cubeIndex / side) % side);
            const z = Math.floor(cubeIndex / (side * side));
            const cubeX = (x - side / 2) * step;
            const cubeY = (y - side / 2) * step;
            const cubeZ = (z - side / 2) * step;

            // Blend positions
            let targetX = cloudX * phase1Weight + sphereX * phase2Weight + cubeX * phase3Weight;
            let targetY = cloudY * phase1Weight + sphereY * phase2Weight + cubeY * phase3Weight;
            let targetZ = cloudZ * phase1Weight + sphereZ * phase2Weight + cubeZ * phase3Weight;

            // Individual particle rotation (orbital motion)
            const particleAngle = time * 0.1 + i * 0.01;
            const rotationRadius = 0.5 * (phase1Weight * 1.5 + phase2Weight * 0.8 + phase3Weight * 0.3);

            targetX += Math.cos(particleAngle) * rotationRadius;
            targetZ += Math.sin(particleAngle) * rotationRadius;

            // Cloud-specific: Gentle spiral rotation towards viewer
            if (phase1Weight > 0) {
                const distance = Math.sqrt(targetX * targetX + targetY * targetY);
                const spiralAngle = Math.atan2(targetY, targetX) + (time * 0.15 * phase1Weight);
                const spiralRadius = distance * (1 - phase1Weight * 0.05); // Very slight inward pull

                targetX = targetX * (1 - phase1Weight * 0.15) + Math.cos(spiralAngle) * spiralRadius * phase1Weight * 0.15;
                targetY = targetY * (1 - phase1Weight * 0.15) + Math.sin(spiralAngle) * spiralRadius * phase1Weight * 0.15;
            }

            // Smooth movement toward target (faster during cloud for smoother entrance)
            const moveSpeed = phase1Weight > 0 ? 0.05 : 0.02;
            positions[ix] += (targetX - positions[ix]) * moveSpeed;
            positions[iy] += (targetY - positions[iy]) * moveSpeed;
            positions[iz] += (targetZ - positions[iz]) * moveSpeed;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={initialPos.length / 3}
                    array={initialPos}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={0.04}
                vertexColors
                sizeAttenuation
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default function AnimationV10_SmoothCycle() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #020a10 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 18], fov: 55 }} dpr={[1, 2]}>
                <ambientLight intensity={0.6} />
                <BiologicalParticles />
            </Canvas>
        </div>
    );
}
