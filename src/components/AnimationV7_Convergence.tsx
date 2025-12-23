import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 20000;
const CLUSTER_COUNT = 5;
const ANIMATION_SPEED = 0.015; // Slightly faster for convergence energy

// --- Geometry Generators ---

// 1. Five Distinct Clusters (The "5 Intelligences")
const getClusters = (count: number) => {
    const positions = new Float32Array(count * 3);
    const particlesPerCluster = Math.floor(count / CLUSTER_COUNT);
    const clusterSpread = 14; // How far apart the centers are

    for (let c = 0; c < CLUSTER_COUNT; c++) {
        // Calculate cluster center (arranged in a pentagon/circle)
        const angle = (c / CLUSTER_COUNT) * Math.PI * 2;
        const centerX = Math.cos(angle) * clusterSpread;
        const centerY = Math.sin(angle) * clusterSpread;
        // Z-depth variation for 3D feel
        const centerZ = (Math.random() - 0.5) * 5;

        for (let i = 0; i < particlesPerCluster; i++) {
            const idx = (c * particlesPerCluster + i) * 3;

            // Random diffusion within cluster (Gaussian-ish)
            // r = random radius from center
            const r = Math.pow(Math.random(), 0.5) * 6; // Cluster radius
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[idx] = centerX + r * Math.sin(phi) * Math.cos(theta);
            positions[idx + 1] = centerY + r * Math.sin(phi) * Math.sin(theta);
            positions[idx + 2] = centerZ + r * Math.cos(phi);
        }
    }
    // Fill remainder if any
    return positions;
};

// 2. The Singularity (Converged Super-Intelligence)
const getSingularity = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Dense central sphere
        const r = Math.pow(Math.random(), 3) * 7; // Power 3 biases heavily towards center (dense core)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
};

const ConvergenceParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Data ---
    const { clusterPos, singularityPos, colors } = useMemo(() => {
        const cl = getClusters(PARTICLE_COUNT);
        const sg = getSingularity(PARTICLE_COUNT);

        // Colors: Each cluster gets a slight tint?
        // Let's keep it "Kempion style" - mostly Blue/White, but maybe subtle variations
        const cols = new Float32Array(PARTICLE_COUNT * 3);
        const particlesPerCluster = Math.floor(PARTICLE_COUNT / CLUSTER_COUNT);

        // Base Colors
        const bases = [
            new THREE.Color("#00aaff"), // Blue
            new THREE.Color("#00ffff"), // Cyan
            new THREE.Color("#4da6ff"), // Sky
            new THREE.Color("#0088cc"), // Deep
            new THREE.Color("#e0f7ff"), // White-ish
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Determine which cluster this particle originally belongs to
            const clusterIdx = Math.floor(i / particlesPerCluster);
            const validIdx = Math.min(clusterIdx, 4);
            const baseCol = bases[validIdx];

            // 10% chance of being "Hot White" regardless of cluster
            const isHot = Math.random() > 0.9;

            if (isHot) {
                cols[i * 3] = 1.0;
                cols[i * 3 + 1] = 1.0;
                cols[i * 3 + 2] = 1.0;
            } else {
                cols[i * 3] = baseCol.r;
                cols[i * 3 + 1] = baseCol.g;
                cols[i * 3 + 2] = baseCol.b;
            }
        }

        return { clusterPos: cl, singularityPos: sg, colors: cols };
    }, []);

    // --- State ---
    const state = useRef({
        targetPositions: clusterPos,
        mixRatio: 0 // 0 = Clusters, 1 = Singularity
    });

    // --- Scroll Handler ---
    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h === 0) return;

            const progress = window.scrollY / h;
            // 0 -> 1

            // Map scroll to mix ratio
            // We want them to start converging immediately but slowly, then snap together
            // Let's try direct mapping first
            state.current.mixRatio = Math.min(Math.max(progress * 1.2, 0), 1);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Render Loop ---
    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        const time = clock.getElapsedTime();

        // Add rotation based on mix
        // Clusters rotate slowly separate? No, global rotation is simpler.
        // As they converge, rotation speeds up (conservation of angular momentum feel)
        const rotationSpeed = 0.02 + (s.mixRatio * 0.08);
        pointsRef.current.rotation.y += rotationSpeed * 0.01 + 0.001;
        // Add slight Z-tilt
        pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;


        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            // Interpolate Target
            // We LERP the *target*, or we LERP the *position*?
            // "Simplify" -> LERP the target, let physics catch up.

            const pct = s.mixRatio;
            // Ease in/out
            const t = pct * pct * (3 - 2 * pct);

            const tx = clusterPos[ix] + (singularityPos[ix] - clusterPos[ix]) * t;
            const ty = clusterPos[iy] + (singularityPos[iy] - clusterPos[iy]) * t;
            const tz = clusterPos[iz] + (singularityPos[iz] - clusterPos[iz]) * t;

            // Noise (Organic) - reduces as they converge (more ordered)
            const noiseAmp = 0.05 * (1 - t) + 0.01;
            const noise = Math.sin(time + i * 0.01) * noiseAmp;

            // Update Position with spring/lerp
            positions[ix] += (tx + noise - positions[ix]) * ANIMATION_SPEED;
            positions[iy] += (ty + noise - positions[iy]) * ANIMATION_SPEED;
            positions[iz] += (tz + noise - positions[iz]) * ANIMATION_SPEED;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={clusterPos.length / 3}
                    array={clusterPos.slice()} // Copy to not mutate source
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
                size={0.035}
                vertexColors
                sizeAttenuation
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default function AnimationV7_Convergence() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #020a10 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 22], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.4} />
                <ConvergenceParticles />
            </Canvas>
        </div>
    );
}
