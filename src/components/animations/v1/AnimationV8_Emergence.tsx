// @ts-nocheck
/**
 * AnimationV8_Emergence
 *
 * A novel approach to visualizing the natural convergence of intelligence:
 * - Cloud: Raw potential, chaos, distributed intelligence (brownian motion)
 * - Sphere: Self-organization, harmony, emergence (orbital dynamics)
 * - Cube: Crystallized structure, precision, understanding (resonant grid)
 *
 * Key innovations:
 * - 3000 particles (lightweight, performant)
 * - Continuous flow (no discrete phases)
 * - Particle momentum and attraction forces
 * - Color temperature shift: warm → neutral → cool
 * - Breathing/pulsing rhythm
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 3000;
const PARTICLE_SIZE = 0.04;

// Geometry generators
const getCloud = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Gaussian cloud distribution
        const r = Math.abs(THREE.MathUtils.randFloatSpread(10)) * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
};

const getSphere = (count: number) => {
    const positions = new Float32Array(count * 3);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < count; i++) {
        const t = i / count;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = angleIncrement * i;

        const r = 5 + Math.sin(i * 0.1) * 0.3; // Slight variation

        positions[i * 3] = r * Math.sin(inclination) * Math.cos(azimuth);
        positions[i * 3 + 1] = r * Math.sin(inclination) * Math.sin(azimuth);
        positions[i * 3 + 2] = r * Math.cos(inclination);
    }
    return positions;
};

const getCube = (count: number) => {
    const positions = new Float32Array(count * 3);
    const gridSize = Math.ceil(Math.pow(count, 1/3));
    const spacing = 8 / gridSize;
    const offset = -4;

    for (let i = 0; i < count; i++) {
        const x = (i % gridSize);
        const y = Math.floor((i / gridSize) % gridSize);
        const z = Math.floor(i / (gridSize * gridSize));

        // Add slight harmonic oscillation to grid positions
        const harmonic = Math.sin(x * 0.5) * Math.cos(y * 0.5) * Math.sin(z * 0.5) * 0.3;

        positions[i * 3] = offset + x * spacing + harmonic;
        positions[i * 3 + 1] = offset + y * spacing + harmonic * 0.5;
        positions[i * 3 + 2] = offset + z * spacing + harmonic * 0.3;
    }
    return positions;
};

const EmergenceParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate all three states
    const { cloudPos, spherePos, cubePos, velocities } = useMemo(() => {
        return {
            cloudPos: getCloud(PARTICLE_COUNT),
            spherePos: getSphere(PARTICLE_COUNT),
            cubePos: getCube(PARTICLE_COUNT),
            velocities: new Float32Array(PARTICLE_COUNT * 3) // For momentum
        };
    }, []);

    // Dynamic colors (will update in render loop)
    const colors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;

        const time = clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const colorArray = pointsRef.current.geometry.attributes.color.array as Float32Array;

        // Continuous cycling: 30 second loop
        // 0-10s: Cloud → Sphere
        // 10-20s: Sphere → Cube
        // 20-30s: Cube → Cloud
        const cycle = (time * 0.5) % 3; // 0-3 range

        let weight1 = 0, weight2 = 0, weight3 = 0;
        let temp = 0; // Color temperature: 0=warm(cloud), 0.5=neutral(sphere), 1=cool(cube)

        if (cycle < 1) {
            // Cloud → Sphere transition
            const t = cycle;
            weight1 = 1 - t;
            weight2 = t;
            weight3 = 0;
            temp = t * 0.5;
        } else if (cycle < 2) {
            // Sphere → Cube transition
            const t = cycle - 1;
            weight1 = 0;
            weight2 = 1 - t;
            weight3 = t;
            temp = 0.5 + t * 0.5;
        } else {
            // Cube → Cloud transition
            const t = cycle - 2;
            weight1 = t;
            weight2 = 0;
            weight3 = 1 - t;
            temp = 1 - t;
        }

        // Breathing pulse (0.85 - 1.15 scale)
        const breathe = 1 + Math.sin(time * 0.8) * 0.15;

        // Update each particle
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Blend positions with momentum
            const targetX =
                cloudPos[i3] * weight1 +
                spherePos[i3] * weight2 +
                cubePos[i3] * weight3;
            const targetY =
                cloudPos[i3 + 1] * weight1 +
                spherePos[i3 + 1] * weight2 +
                cubePos[i3 + 1] * weight3;
            const targetZ =
                cloudPos[i3 + 2] * weight1 +
                spherePos[i3 + 2] * weight2 +
                cubePos[i3 + 2] * weight3;

            // Apply attraction force (spring-like)
            const dx = targetX - positions[i3];
            const dy = targetY - positions[i3 + 1];
            const dz = targetZ - positions[i3 + 2];

            // Different spring constants for different states
            const stiffness = 0.02 + weight3 * 0.03; // Stiffer in cube state
            const damping = 0.85 + weight2 * 0.1; // More damping in sphere

            velocities[i3] = velocities[i3] * damping + dx * stiffness;
            velocities[i3 + 1] = velocities[i3 + 1] * damping + dy * stiffness;
            velocities[i3 + 2] = velocities[i3 + 2] * damping + dz * stiffness;

            // Brownian motion in cloud state
            if (weight1 > 0) {
                velocities[i3] += THREE.MathUtils.randFloatSpread(0.02) * weight1;
                velocities[i3 + 1] += THREE.MathUtils.randFloatSpread(0.02) * weight1;
                velocities[i3 + 2] += THREE.MathUtils.randFloatSpread(0.02) * weight1;
            }

            // Orbital velocity in sphere state
            if (weight2 > 0) {
                const orbitalSpeed = 0.01 * weight2;
                velocities[i3] += -positions[i3 + 1] * orbitalSpeed;
                velocities[i3 + 1] += positions[i3] * orbitalSpeed;
            }

            // Update positions
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Apply breathing scale
            positions[i3] *= breathe;
            positions[i3 + 1] *= breathe;
            positions[i3 + 2] *= breathe;

            // Color temperature mapping
            // Warm (amber/orange) → Neutral (white) → Cool (blue)
            if (temp < 0.5) {
                // Cloud to Sphere: Warm to White
                const t = temp * 2;
                colorArray[i3] = 1.0; // R
                colorArray[i3 + 1] = 0.6 + t * 0.4; // G: amber→white
                colorArray[i3 + 2] = 0.3 + t * 0.7; // B: amber→white
            } else {
                // Sphere to Cube: White to Cool Blue
                const t = (temp - 0.5) * 2;
                colorArray[i3] = 1.0 - t * 0.3; // R: white→cool
                colorArray[i3 + 1] = 1.0 - t * 0.2; // G: white→cool
                colorArray[i3 + 2] = 1.0; // B: stays high
            }

            // Add sparkle to some particles
            if (i % 50 === 0) {
                const sparkle = Math.sin(time * 5 + i) * 0.5 + 0.5;
                colorArray[i3] = Math.min(1, colorArray[i3] + sparkle * 0.3);
                colorArray[i3 + 1] = Math.min(1, colorArray[i3 + 1] + sparkle * 0.3);
                colorArray[i3 + 2] = Math.min(1, colorArray[i3 + 2] + sparkle * 0.3);
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate = true;

        // Global rotation (very subtle)
        pointsRef.current.rotation.y = time * 0.03;
        pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={new Float32Array(PARTICLE_COUNT * 3)}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={PARTICLE_COUNT}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={PARTICLE_SIZE}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

const AnimationV8_Emergence = () => {
    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 50 }}
            style={{ background: 'transparent' }}
        >
            <EmergenceParticles />
        </Canvas>
    );
};

export default AnimationV8_Emergence;
