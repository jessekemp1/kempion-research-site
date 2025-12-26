// @ts-nocheck
/**
 * AnimationV9_DecisionField
 *
 * Visualizes decision intelligence concepts, not abstract "intelligence emergence"
 *
 * Core Ideas:
 * - UNCERTAINTY FIELD: Noise represents incomplete information
 * - SCENARIO BANDS: Three probability streams (optimistic/likely/conservative)
 * - DECISION PATH: A single thread finding its way through uncertainty
 * - CALIBRATION: Bands tighten as the system "learns" from feedback
 *
 * This directly maps to Kempion's philosophy:
 * "Making uncertainty visible, actionable, and measurable"
 *
 * Innovations:
 * - 2500 particles (lean)
 * - Stratified layers (3 scenario bands + noise field)
 * - Progressive convergence (uncertainty → clarity)
 * - Non-cyclical: starts unclear, ends refined
 * - Restart with new "decision"
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLES_PER_BAND = 500; // 3 bands = 1500
const NOISE_PARTICLES = 1000;
const TOTAL_PARTICLES = PARTICLES_PER_BAND * 3 + NOISE_PARTICLES;

const BAND_RADIUS_OPTIMISTIC = 3.5;
const BAND_RADIUS_LIKELY = 5.0;
const BAND_RADIUS_CONSERVATIVE = 6.5;

const DecisionFieldParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate particle assignments
    const particleData = useMemo(() => {
        const positions = new Float32Array(TOTAL_PARTICLES * 3);
        const velocities = new Float32Array(TOTAL_PARTICLES * 3);
        const colors = new Float32Array(TOTAL_PARTICLES * 3);
        const types = new Float32Array(TOTAL_PARTICLES); // 0=noise, 1=optimistic, 2=likely, 3=conservative

        // Helper: spiral on cylinder
        const getSpiralPoint = (index: number, total: number, radius: number, height: number, turns: number) => {
            const t = index / total;
            const angle = t * Math.PI * 2 * turns;
            const z = (t - 0.5) * height;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            // Add slight radial variation
            const radialNoise = (Math.random() - 0.5) * 0.4;
            return {
                x: x + radialNoise * Math.cos(angle),
                y: y + radialNoise * Math.sin(angle),
                z: z + (Math.random() - 0.5) * 0.3
            };
        };

        let idx = 0;

        // 1. Optimistic Band (innermost, blue)
        for (let i = 0; i < PARTICLES_PER_BAND; i++) {
            const pos = getSpiralPoint(i, PARTICLES_PER_BAND, BAND_RADIUS_OPTIMISTIC, 10, 3);
            positions[idx * 3] = pos.x;
            positions[idx * 3 + 1] = pos.y;
            positions[idx * 3 + 2] = pos.z;

            colors[idx * 3] = 0.3;
            colors[idx * 3 + 1] = 0.6;
            colors[idx * 3 + 2] = 1.0; // Blue

            types[idx] = 1;
            idx++;
        }

        // 2. Likely Band (middle, white)
        for (let i = 0; i < PARTICLES_PER_BAND; i++) {
            const pos = getSpiralPoint(i, PARTICLES_PER_BAND, BAND_RADIUS_LIKELY, 10, 3);
            positions[idx * 3] = pos.x;
            positions[idx * 3 + 1] = pos.y;
            positions[idx * 3 + 2] = pos.z;

            colors[idx * 3] = 1.0;
            colors[idx * 3 + 1] = 1.0;
            colors[idx * 3 + 2] = 1.0; // White

            types[idx] = 2;
            idx++;
        }

        // 3. Conservative Band (outer, amber)
        for (let i = 0; i < PARTICLES_PER_BAND; i++) {
            const pos = getSpiralPoint(i, PARTICLES_PER_BAND, BAND_RADIUS_CONSERVATIVE, 10, 3);
            positions[idx * 3] = pos.x;
            positions[idx * 3 + 1] = pos.y;
            positions[idx * 3 + 2] = pos.z;

            colors[idx * 3] = 1.0;
            colors[idx * 3 + 1] = 0.7;
            colors[idx * 3 + 2] = 0.3; // Amber

            types[idx] = 3;
            idx++;
        }

        // 4. Noise Field (uncertainty)
        for (let i = 0; i < NOISE_PARTICLES; i++) {
            const r = Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[idx * 3 + 2] = (Math.random() - 0.5) * 12;

            colors[idx * 3] = 0.4;
            colors[idx * 3 + 1] = 0.4;
            colors[idx * 3 + 2] = 0.5; // Gray-blue

            types[idx] = 0;
            idx++;
        }

        return { positions, velocities, colors, types };
    }, []);

    const initialPositions = useMemo(() => new Float32Array(particleData.positions), [particleData]);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;

        const time = clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const colorArray = pointsRef.current.geometry.attributes.color.array as Float32Array;

        // Cycle: 40 seconds (slower)
        // 0-8s: Uncertain (bands wide, noise high)
        // 8-24s: Calibrating (bands converge, noise fades)
        // 24-32s: Refined (bands tight, clear prediction)
        // 32-40s: Reset (fade out, restart)

        const cycle = time % 40;
        let calibration = 0; // 0 = uncertain, 1 = refined
        let fadeAlpha = 1;

        if (cycle < 8) {
            // Uncertain phase
            calibration = 0;
        } else if (cycle < 24) {
            // Calibrating (smooth convergence)
            const t = (cycle - 8) / 16;
            calibration = t * t * (3 - 2 * t); // Smoothstep
        } else if (cycle < 32) {
            // Refined (hold)
            calibration = 1;
        } else {
            // Reset (fade out)
            const t = (cycle - 32) / 8;
            calibration = 1 - t;
            fadeAlpha = 1 - t;
        }

        // Update particles
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
            const i3 = i * 3;
            const type = particleData.types[i];

            const initX = initialPositions[i3];
            const initY = initialPositions[i3 + 1];
            const initZ = initialPositions[i3 + 2];

            if (type === 0) {
                // Noise field: fade out as calibration increases
                const noiseFactor = 1 - calibration * 0.85;
                positions[i3] = initX * noiseFactor;
                positions[i3 + 1] = initY * noiseFactor;
                positions[i3 + 2] = initZ * noiseFactor;

                // Brownian drift
                positions[i3] += THREE.MathUtils.randFloatSpread(0.03) * noiseFactor;
                positions[i3 + 1] += THREE.MathUtils.randFloatSpread(0.03) * noiseFactor;

                // Fade opacity (brighter)
                colorArray[i3] = 0.6 * noiseFactor * fadeAlpha;
                colorArray[i3 + 1] = 0.6 * noiseFactor * fadeAlpha;
                colorArray[i3 + 2] = 0.7 * noiseFactor * fadeAlpha;
            } else {
                // Scenario bands: converge toward center as calibration increases
                const bandRadius = type === 1 ? BAND_RADIUS_OPTIMISTIC :
                                 type === 2 ? BAND_RADIUS_LIKELY :
                                 BAND_RADIUS_CONSERVATIVE;

                // Target: shrink radius as we calibrate
                const targetRadius = bandRadius * (1 - calibration * 0.6);
                const currentRadius = Math.sqrt(initX * initX + initY * initY);
                const scale = currentRadius > 0 ? targetRadius / currentRadius : 1;

                positions[i3] = initX * scale;
                positions[i3 + 1] = initY * scale;
                positions[i3 + 2] = initZ;

                // Gentle spiral drift (slower)
                const drift = time * 0.03 * (1 - calibration * 0.5);
                const angle = Math.atan2(positions[i3 + 1], positions[i3]);
                const newAngle = angle + drift * 0.015;
                const r = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 1] * positions[i3 + 1]);

                positions[i3] = r * Math.cos(newAngle);
                positions[i3 + 1] = r * Math.sin(newAngle);

                // Brightness increases with calibration (confidence) - brighter overall
                const brightness = 0.7 + calibration * 0.3;
                colorArray[i3] = particleData.colors[i3] * brightness * fadeAlpha;
                colorArray[i3 + 1] = particleData.colors[i3 + 1] * brightness * fadeAlpha;
                colorArray[i3 + 2] = particleData.colors[i3 + 2] * brightness * fadeAlpha;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate = true;

        // Camera: slow zoom in as we calibrate (slower rotation)
        pointsRef.current.rotation.z = time * 0.01;
        pointsRef.current.position.z = -calibration * 2;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={TOTAL_PARTICLES}
                    array={particleData.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={TOTAL_PARTICLES}
                    array={particleData.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                vertexColors
                transparent
                opacity={0.9}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

const AnimationV9_DecisionField = () => {
    return (
        <Canvas
            camera={{ position: [0, 0, 16], fov: 45 }}
            style={{ background: 'transparent' }}
        >
            <DecisionFieldParticles />
        </Canvas>
    );
};

export default AnimationV9_DecisionField;
