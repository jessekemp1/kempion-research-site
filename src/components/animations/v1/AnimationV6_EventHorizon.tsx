// @ts-nocheck
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 20000;
const ANIMATION_SPEED = 0.008;

// Geometries
const CUBE_SIZE = 7.5;
const SPHERE_RADIUS = 4.8;

// Void Dimensions
const INNER_CUBE_SIZE = 3.5;
const INNER_SPHERE_RADIUS = 2.0; // Hollow sphere center

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

        // Hollow sphere - exclude particles within inner radius
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
        const insideInnerSphere = distanceFromCenter < INNER_SPHERE_RADIUS;

        if (!insideInnerSphere) {
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
        // Multi-layered distribution for depth and immersion
        const layer = Math.random();

        if (layer < 0.4) {
            // Dense core (40%)
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        } else if (layer < 0.7) {
            // Mid layer (30%)
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
        } else {
            // Outer wisps (30%)
            const angle = Math.random() * Math.PI * 2;
            const radius = 25 + Math.random() * 20;
            positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 15;
        }
    }
    return positions;
};

const getFlowPast = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Create streaming flow pattern toward viewer
        const streamLayer = Math.random();

        if (streamLayer < 0.3) {
            // Fast stream (30%) - closest to camera
            positions[i * 3] = (Math.random() - 0.5) * 70;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = 20 + Math.random() * 50;
        } else if (streamLayer < 0.6) {
            // Mid stream (30%)
            positions[i * 3] = (Math.random() - 0.5) * 85;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
            positions[i * 3 + 2] = 10 + Math.random() * 40;
        } else {
            // Outer vortex stream (40%) - creates tunnel effect
            const angle = Math.random() * Math.PI * 2;
            const radius = 30 + Math.random() * 25;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
            positions[i * 3 + 2] = 15 + Math.random() * 45;
        }
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
    const scrollState = useRef({
        isScrolling: false,
        scrollVelocity: 0,
        lastScrollTime: 0
    });

    // --- Scroll Handler ---
    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            const now = performance.now();
            const timeDelta = now - scrollState.current.lastScrollTime;

            scrollState.current.isScrolling = true;
            scrollState.current.scrollVelocity = Math.min(timeDelta > 0 ? 1000 / timeDelta : 0, 10);
            scrollState.current.lastScrollTime = now;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollState.current.isScrolling = false;
                scrollState.current.scrollVelocity = 0;
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // --- Render Loop ---
    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const time = clock.getElapsedTime();

        // Cycle timing (49 second loop):
        // 0-3s: Cloud (hold, 3s, rotating towards viewer)
        // 3-6s: Cloud → Sphere (transition, 3s)
        // 6-13s: Sphere (hold, rotating, 7s)
        // 13-17s: Sphere → Cube (transition, 4s)
        // 17-24s: Cube (hold, rotating, 7s)
        // 24-28s: Cube → Sphere (transition, 4s, first oscillation)
        // 28-35s: Sphere (hold, rotating, 7s)
        // 35-39s: Sphere → Cube (transition, 4s, second oscillation)
        // 39-46s: Cube (hold, rotating, 7s)
        // 46-49s: Cube → Cloud (transition, 3s - expands forward toward viewer)
        // Then restart (seamless loop back to initial cloud)

        const cycle = time % 49;
        let phase1Weight = 0, phase2Weight = 0, phase3Weight = 0; // cloud, sphere, cube

        if (cycle < 3) {
            // Cloud hold (3s)
            phase1Weight = 1;
            phase2Weight = 0;
            phase3Weight = 0;
        } else if (cycle < 6) {
            // Cloud → Sphere transition (3s)
            const t = (cycle - 3) / 3;
            const eased = t * t * (3 - 2 * t); // Smoothstep
            phase1Weight = 1 - eased;
            phase2Weight = eased;
            phase3Weight = 0;
        } else if (cycle < 13) {
            // Sphere hold (7s)
            phase1Weight = 0;
            phase2Weight = 1;
            phase3Weight = 0;
        } else if (cycle < 17) {
            // Sphere → Cube transition (4s)
            const t = (cycle - 13) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = 0;
            phase2Weight = 1 - eased;
            phase3Weight = eased;
        } else if (cycle < 24) {
            // Cube hold (7s)
            phase1Weight = 0;
            phase2Weight = 0;
            phase3Weight = 1;
        } else if (cycle < 28) {
            // Cube → Sphere transition (4s, first oscillation)
            const t = (cycle - 24) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = 0;
            phase2Weight = eased;
            phase3Weight = 1 - eased;
        } else if (cycle < 35) {
            // Sphere hold (7s)
            phase1Weight = 0;
            phase2Weight = 1;
            phase3Weight = 0;
        } else if (cycle < 39) {
            // Sphere → Cube transition (4s, second oscillation)
            const t = (cycle - 35) / 4;
            const eased = t * t * (3 - 2 * t);
            phase1Weight = 0;
            phase2Weight = 1 - eased;
            phase3Weight = eased;
        } else if (cycle < 46) {
            // Cube hold (7s)
            phase1Weight = 0;
            phase2Weight = 0;
            phase3Weight = 1;
        } else {
            // Cube → Cloud transition (3s - expands forward toward viewer)
            const t = (cycle - 46) / 3;
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

            // Cloud target (from cloudPos with immersive flow effect)
            // Initial cloud phase (0-3s): Swirling vortex pulling toward viewer
            // Final transition (46-49s): Explosive expansion from cube, rushing toward viewer
            const isInFinalTransition = cycle >= 46 && cycle < 49;
            const finalTransitionProgress = isInFinalTransition ? (cycle - 46) / 3 : 0;

            // Enhanced flow for immersion
            const baseFlowInfluence = phase1Weight * 1.5; // Stronger initial flow
            const explosiveFlow = finalTransitionProgress * 1.2; // Dramatic final expansion
            const flowInfluence = baseFlowInfluence + explosiveFlow;

            // Depth effect - particles further back rush forward faster
            const depthFactor = (cloudPos[iz] + 20) / 40; // Normalize to 0-1
            const depthBoost = depthFactor * flowInfluence;

            const cloudX = cloudPos[ix] + (flowPos[ix] - cloudPos[ix]) * flowInfluence * 0.4;
            const cloudY = cloudPos[iy] + (flowPos[iy] - cloudPos[iy]) * flowInfluence * 0.4;
            const cloudZ = cloudPos[iz] + (flowPos[iz] - cloudPos[iz]) * flowInfluence * 0.4 + (time * 0.8 * flowInfluence) + depthBoost;

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

            // Cloud-specific: Enhanced immersive spiral vortex
            if (phase1Weight > 0 || finalTransitionProgress > 0) {
                const cloudStrength = Math.max(phase1Weight, finalTransitionProgress);
                const distance = Math.sqrt(targetX * targetX + targetY * targetY);

                // Faster, more dramatic spiral during cloud phases
                const spiralSpeed = finalTransitionProgress > 0 ? 0.25 : 0.2;
                const spiralAngle = Math.atan2(targetY, targetX) + (time * spiralSpeed * cloudStrength);

                // Pulsing vortex effect
                const pulse = Math.sin(time * 2.0 + i * 0.05) * 0.3;
                const spiralRadius = distance * (1 - cloudStrength * 0.08 + pulse * cloudStrength);

                const spiralInfluence = cloudStrength * 0.25;
                targetX = targetX * (1 - spiralInfluence) + Math.cos(spiralAngle) * spiralRadius * spiralInfluence;
                targetY = targetY * (1 - spiralInfluence) + Math.sin(spiralAngle) * spiralRadius * spiralInfluence;
            }

            // Scroll interaction: Particles melt/fall down into text area
            const scroll = scrollState.current;
            if (scroll.isScrolling) {
                const fallForce = scroll.scrollVelocity * 0.5;
                const distanceFromCenter = Math.sqrt(targetX * targetX + targetY * targetY);

                // Particles closer to center fall more (melting into text)
                const centerPull = Math.max(0, 1 - distanceFromCenter / 10);
                const fallAmount = fallForce * (0.5 + centerPull * 1.5);

                // Apply downward force and slight inward pull
                targetY -= fallAmount;
                targetX *= (1 - centerPull * 0.02);
                targetZ += fallForce * 0.3; // Slight forward movement
            }

            // Smooth movement toward target (faster during cloud for immersive entrance)
            const moveSpeed = (phase1Weight > 0 || finalTransitionProgress > 0) ? 0.08 : 0.02;
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
                {/* Size attenuation is handled by material, but we can pass sizes as attribute if using custom shader. 
                     For standard PointsMaterial, we can't easily vary size per particle without a shader.
                     So we'll stick to uniform size for now OR switch to ShaderMaterial.
                     BUT the user requested "make some brighter and glow". Brighter is done via colors.
                     Let's use a standard material first for stability, but enable vertexColors.
                 */}
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={0.04} // Slightly larger base size
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

export default function AnimationV6_EventHorizon() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #020a10 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 18], fov: 55 }} dpr={[1, 2]}>
                <ambientLight intensity={0.6} />
                <BiologicalParticles />
            </Canvas>
        </div>
    );
}
