// @ts-nocheck
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 20000;
const ANIMATION_SPEED = 0.02;

// --- Geometry Generators ---

const getCloud = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Natural dispersal
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
};

const getSphere = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Dense central core ("Unity")
        const power = 4; // Slightly less tight than singular V7, more volume
        const r = Math.pow(Math.random(), power) * 9;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
};

const getCube = (count: number) => {
    const positions = new Float32Array(count * 3);
    const side = Math.cbrt(count);
    const size = 12; // Cube size
    const step = size / side;

    // Structured Grid = "Genius/Logic"
    let i = 0;
    for (let x = 0; x < side; x++) {
        for (let y = 0; y < side; y++) {
            for (let z = 0; z < side; z++) {
                if (i >= count) break;
                // Add jitter for organic feel
                positions[i * 3] = (x - side / 2) * step + (Math.random() - 0.5) * 0.2;
                positions[i * 3 + 1] = (y - side / 2) * step + (Math.random() - 0.5) * 0.2;
                positions[i * 3 + 2] = (z - side / 2) * step + (Math.random() - 0.5) * 0.2;
                i++;
            }
        }
    }
    // Fill remainder randomly in cube volume
    while (i < count) {
        positions[i * 3] = (Math.random() - 0.5) * size;
        positions[i * 3 + 1] = (Math.random() - 0.5) * size;
        positions[i * 3 + 2] = (Math.random() - 0.5) * size;
        i++;
    }
    return positions;
};

const NaturalGeniusParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Data ---
    const { cloudPos, spherePos, cubePos, colors } = useMemo(() => {
        const c = getCloud(PARTICLE_COUNT);
        const s = getSphere(PARTICLE_COUNT);
        const k = getCube(PARTICLE_COUNT); // K for Cube

        const cols = new Float32Array(PARTICLE_COUNT * 3);

        // Palette: Elegant Blue/White/Cyan
        const bases = [
            new THREE.Color("#0044cc"), // Deep Cobalt
            new THREE.Color("#00aaff"), // Kempion Blue
            new THREE.Color("#99ddff"), // Sky
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const baseCol = bases[Math.floor(Math.random() * bases.length)];

            // 10% "Genius Spark" (Gold/White)
            const isSpark = Math.random() > 0.90;

            if (isSpark) {
                cols[i * 3] = 1.0;
                cols[i * 3 + 1] = 0.95;
                cols[i * 3 + 2] = 0.85;
            } else {
                cols[i * 3] = baseCol.r;
                cols[i * 3 + 1] = baseCol.g;
                cols[i * 3 + 2] = baseCol.b;
            }
        }

        return { cloudPos: c, spherePos: s, cubePos: k, colors: cols };
    }, []);

    // --- State ---
    const state = useRef({
        currentPositions: new Float32Array(cloudPos),
        targetName: 'cloud'
    });

    // --- Render Loop (Choreography) ---
    useFrame(({ clock }, delta) => {
        if (!pointsRef.current) return;
        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // Cycle: ~30s
        // 0-6s: CLOUD (Drift)
        // 6-12s: SPHERE (Concentrate)
        // 12-18s: CUBE (Structure)
        // 18-24s: CUBE (Hold/Rotate)
        // 24-30s: DISPERSE (Back to Cloud)

        const t = clock.getElapsedTime() % 30;

        let target: Float32Array;
        let lerpSpeed = 0.02;
        let noiseAmount = 0.05;

        // Visual Logic
        if (t < 6) {
            target = cloudPos;
            lerpSpeed = 0.01; // Slow drift
            noiseAmount = 0.08;
        } else if (t < 14) {
            target = spherePos;
            lerpSpeed = 0.03; // Form unity
            noiseAmount = 0.02; // Tighter
        } else if (t < 24) {
            target = cubePos;
            lerpSpeed = 0.04; // Snap to structure
            noiseAmount = 0.005; // Rigid
        } else {
            target = cloudPos;
            lerpSpeed = 0.015; // Gentle dispersal
            noiseAmount = 0.1; // Chaos returns
        }

        // Global Rotation
        // Cloud: Slow
        // Sphere: Medium
        // Cube: Fast precision
        // Disperse: Slow
        let rotSpeed = 0.02;
        if (t > 14 && t < 24) rotSpeed = 0.05; // Cube spins faster

        pointsRef.current.rotation.y += rotSpeed * delta;
        pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;


        // Update Particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            const tx = target[ix];
            const ty = target[iy];
            const tz = target[iz];

            // Noise
            const noise = Math.sin(t + i) * noiseAmount;

            positions[ix] += (tx + noise - positions[ix]) * lerpSpeed;
            positions[iy] += (ty + noise - positions[iy]) * lerpSpeed;
            positions[iz] += (tz + noise - positions[iz]) * lerpSpeed;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={cloudPos.length / 3}
                    array={cloudPos.slice()}
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
                size={0.028}
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

export default function AnimationV8_NaturalGenius() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #020a10 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 24], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.4} />
                <NaturalGeniusParticles />
            </Canvas>
        </div>
    );
}
