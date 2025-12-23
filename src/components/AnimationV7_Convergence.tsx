import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 20000;
const CLUSTER_COUNT = 5;
const ANIMATION_SPEED = 0.015;

// --- Geometry Generators ---

// 1. Five Distinct Clusters (The "5 Intelligences")
const getClusters = (count: number) => {
    const positions = new Float32Array(count * 3);
    const particlesPerCluster = Math.floor(count / CLUSTER_COUNT);
    const clusterSpread = 14;

    for (let c = 0; c < CLUSTER_COUNT; c++) {
        const angle = (c / CLUSTER_COUNT) * Math.PI * 2;
        const centerX = Math.cos(angle) * clusterSpread;
        const centerY = Math.sin(angle) * clusterSpread;
        const centerZ = (Math.random() - 0.5) * 5;

        for (let i = 0; i < particlesPerCluster; i++) {
            const idx = (c * particlesPerCluster + i) * 3;

            const r = Math.pow(Math.random(), 0.5) * 6;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[idx] = centerX + r * Math.sin(phi) * Math.cos(theta);
            positions[idx + 1] = centerY + r * Math.sin(phi) * Math.sin(theta);
            positions[idx + 2] = centerZ + r * Math.cos(phi);
        }
    }
    return positions;
};

// 2. The Singularity (Converged Super-Intelligence)
const getSingularity = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Extremely dense central core ("Tight Power")
        // High power (5) creates strong gravity well visual
        const power = 5;
        const r = Math.pow(Math.random(), power) * 6;

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

        const cols = new Float32Array(PARTICLE_COUNT * 3);
        const particlesPerCluster = Math.floor(PARTICLE_COUNT / CLUSTER_COUNT);

        // Base Colors - "Elegant Power" Palette
        // Deep blues, rich cyans, and pure white energy
        const bases = [
            new THREE.Color("#0044cc"), // Deep Cobalt
            new THREE.Color("#00aaff"), // Kempion Blue
            new THREE.Color("#99ddff"), // Sky
            new THREE.Color("#ffffff"), // Pure Energy
            new THREE.Color("#001133"), // Void
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const clusterIdx = Math.floor(i / particlesPerCluster);
            const validIdx = Math.min(clusterIdx, 4);
            const baseCol = bases[validIdx];

            // 20% "Core" particles - Pure White/Warm Gold brightness ("Hope")
            const isCore = Math.random() > 0.8;

            if (isCore) {
                // Subtle warm white for hope/energy
                cols[i * 3] = 1.0;
                cols[i * 3 + 1] = 0.98;
                cols[i * 3 + 2] = 0.90;
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
        mixRatio: 0
    });

    // --- Scroll Handler ---
    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h === 0) return;
            const progress = window.scrollY / h;
            state.current.mixRatio = Math.min(Math.max(progress * 1.2, 0), 1);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Render Loop ---
    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        const time = clock.getElapsedTime();

        const rotationSpeed = 0.02 + (s.mixRatio * 0.08);
        pointsRef.current.rotation.y += rotationSpeed * 0.01 + 0.001;
        pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            const pct = s.mixRatio;
            const t = pct * pct * (3 - 2 * pct);

            const tx = clusterPos[ix] + (singularityPos[ix] - clusterPos[ix]) * t;
            const ty = clusterPos[iy] + (singularityPos[iy] - clusterPos[iy]) * t;
            const tz = clusterPos[iz] + (singularityPos[iz] - clusterPos[iz]) * t;

            // Reduce noise significantly for "Tight" look
            const noiseAmp = 0.015 * (1 - t) + 0.002;
            const noise = Math.sin(time + i * 0.01) * noiseAmp;

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
                    array={clusterPos.slice()}
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
                size={0.028} // Finer
                vertexColors
                sizeAttenuation
                transparent
                opacity={0.9} // Dense/Powerful
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
