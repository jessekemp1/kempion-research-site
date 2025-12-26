// @ts-nocheck
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 20000;
const CLUSTER_COUNT = 5;

// --- Geometry Generators (Preserved from refined version) ---

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

const getSingularity = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const power = 5; // Tight core
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

        // Elegant Power Palette
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

            const isCore = Math.random() > 0.80; // 20% Hope

            if (isCore) {
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
    // mixRatio: 0 (Clusters) -> 1 (Singularity)
    const state = useRef({
        mixRatio: 0,
        time: 0
    });

    // --- Render Loop (The Dance) ---
    useFrame(({ clock }, delta) => {
        if (!pointsRef.current) return;
        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // --- CHOREOGRAPHY ---
        // Cycle: 24s total
        // 0-4s: CLOUD (Dance)
        // 4-10s: CONVERGE (Spiral In)
        // 10-18s: SINGULARITY (Slow/Hold)
        // 18-24s: RELEASE (Spiral Out)

        const totalTime = clock.getElapsedTime();
        const cycle = totalTime % 24;

        let targetMix = 0;
        let pFactor = 0; // Pacing factor (0 = normal, 1 = very slow)

        if (cycle < 4) {
            // CLOUD PHASE
            targetMix = 0;
            pFactor = 0; // Fast/Normal dance
        } else if (cycle < 10) {
            // CONVERGE PHASE (4s to 10s = 6s duration)
            const t = (cycle - 4) / 6;
            // Smoothstep ease
            targetMix = t * t * (3 - 2 * t);
            pFactor = t * 0.5; // Slow down slightly as we approach
        } else if (cycle < 18) {
            // SINGULARITY PHASE (Hold 8s)
            targetMix = 1;
            pFactor = 0.8; // SLOW IT DOWN significantly here
        } else {
            // RELEASE PHASE (18s to 24s = 6s duration)
            const t = (cycle - 18) / 6;
            targetMix = 1 - (t * t * (3 - 2 * t));
            pFactor = 0.2; // Speed back up
        }

        // Smooth follow for mixRatio
        s.mixRatio += (targetMix - s.mixRatio) * 0.05;

        // --- MOTION ---
        // Global Rotation reflects pacing
        // Fast when cloud (0), Slow when singularity (1)
        const rotationSpeed = 0.04 * (1 - pFactor * 0.8);
        pointsRef.current.rotation.y += rotationSpeed * delta * 5;

        // Gentle Sway
        pointsRef.current.rotation.z = Math.sin(totalTime * 0.1) * 0.05;


        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            const pct = s.mixRatio;

            // "The Dance": Orbital Spirals
            // As they converge (pct goes 0->1), we add a tangential force

            // Linear target LERP
            let tx = clusterPos[ix] + (singularityPos[ix] - clusterPos[ix]) * pct;
            let ty = clusterPos[iy] + (singularityPos[iy] - clusterPos[iy]) * pct;
            let tz = clusterPos[iz] + (singularityPos[iz] - clusterPos[iz]) * pct;

            // Spiral Offset: twist tx/ty around center based on PCT
            if (pct > 0.1 && pct < 0.9) {
                const twist = pct * 2.0; // Twist amount
                const cosT = Math.cos(twist);
                const sinT = Math.sin(twist);
                const twistedX = tx * cosT - tz * sinT;
                const twistedZ = tx * sinT + tz * cosT;
                tx = twistedX;
                tz = twistedZ;
            }

            // Biological Noise
            // Reduced amplitude when pFactor is high (Singularity) -> "Slow/Calm"
            const noiseAmp = (0.015 * (1 - pct) + 0.002) * (1 - pFactor * 0.5);
            // Slower frequency when in Singularity
            const noiseFreq = (0.5 + i * 0.0001) * (1 - pFactor * 0.8);

            const noise = Math.sin(totalTime * 2.0 * noiseFreq) * noiseAmp;

            // Update Position (Spring physics feel)
            // Speed also modulated by pacing (make it snap less, float more)
            const speed = 0.02 * (1 - pFactor * 0.6);

            positions[ix] += (tx + noise - positions[ix]) * speed;
            positions[iy] += (ty + noise - positions[iy]) * speed;
            positions[iz] += (tz + noise - positions[iz]) * speed;
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
                size={0.028} // Refined Elegant Size
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
