import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 8000;
const PARTICLE_SIZE = 0.035; // Slightly finer
const ANIMATION_SPEED = 0.008; // Much slower for "natural" feel

// Geometries
const CUBE_SIZE = 7.5;
const SPHERE_RADIUS = 4.8;

// Void Dimensions
const INNER_CUBE_SIZE = 3.5;
const INNER_SPHERE_RADIUS = 3.0;

// Event Horizon Dimensions
const EH_INNER_RADIUS = 2.5;
const EH_OUTER_RADIUS = 9.0;

// --- Geometry Generators ---

// 1. Sphere with Cube Void
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

// 2. Cube with Sphere Void
const getVoidCube = (count: number) => {
    const positions = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
        const x = (Math.random() - 0.5) * CUBE_SIZE;
        const y = (Math.random() - 0.5) * CUBE_SIZE;
        const z = (Math.random() - 0.5) * CUBE_SIZE;

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

// 3. Event Horizon (Dense Ring / Accretion Disk)
const getEventHorizon = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Random Angle
        const theta = Math.random() * Math.PI * 2;

        // Radius: Weighted towards center for "horizon" feel? Or uniform?
        // Let's go uniform for now, but create a distinct "gap" in the middle.
        // r = sqrt(random) * (max - min) + min to distribute evenly in area
        const r = Math.sqrt(Math.random()) * (EH_OUTER_RADIUS - EH_INNER_RADIUS) + EH_INNER_RADIUS;

        // Thin disk with slight variation
        const y = (Math.random() - 0.5) * 0.5;

        // Apply
        positions[i * 3] = r * Math.cos(theta);
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = r * Math.sin(theta);
    }
    return positions;
};

const getCloud = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60; // Wider drift
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
};

// 4. Flow Past (Circulate Past Camera)
const getFlowPast = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Wide X/Y similar to cloud
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;

        // Z Axis: heavily distributed towards/past camera
        // Camera is at +18. We want particles to fly past it.
        // Range: 10 to 50?
        positions[i * 3 + 2] = 10 + Math.random() * 40;
    }
    return positions;
};


const BiologicalParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Data ---
    const { cloudPos, voidSpherePos, flowPos, eventHorizonPos, initialPos } = useMemo(() => {
        const c = getCloud(PARTICLE_COUNT);
        const vs = getVoidSphere(PARTICLE_COUNT);
        const flow = getFlowPast(PARTICLE_COUNT);
        const eh = getEventHorizon(PARTICLE_COUNT);
        const init = new Float32Array(c);
        return { cloudPos: c, voidSpherePos: vs, flowPos: flow, eventHorizonPos: eh, initialPos: init };
    }, []);


    // --- State ---
    const state = useRef({
        targetPositions: cloudPos,
        phase: 'cloud', // cloud -> sphere -> cube -> horizon -> cloud
    });

    // --- Cycle Logic ---
    useEffect(() => {
        const s = state.current;

        const loop = async () => {
            while (true) {
                // 1. Cloud (Start/Reset) - Hold for 10s
                console.log("Phase: Cloud (10s)");
                s.phase = 'cloud';
                s.targetPositions = cloudPos;
                await new Promise(r => setTimeout(r, 10000));

                // 2. Event Horizon - 12s
                console.log("Phase: Event Horizon");
                s.phase = 'horizon';
                s.targetPositions = eventHorizonPos;
                await new Promise(r => setTimeout(r, 12000));

                // 3. Void Sphere - 12s
                console.log("Phase: Void Sphere");
                s.phase = 'sphere';
                s.targetPositions = voidSpherePos;
                await new Promise(r => setTimeout(r, 12000));

                // 4. Flow Past (Circulating) - 10s
                // "The cloud circulates past the user like the user is in the sphere motion"
                console.log("Phase: Flow Past");
                s.phase = 'flow';
                s.targetPositions = flowPos;
                await new Promise(r => setTimeout(r, 10000));


                // Loop restarts (back to step 1)
            }
        };

        loop();

        // No cleanup needed for the async loop in this simple demo context, 
        // essentially it runs forever. A ref-based valid check could be added for strictness.
    }, []);

    // --- Render Loop (Biological LERP) ---
    useFrame(({ clock }, delta) => {
        if (!pointsRef.current) return;
        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const targets = s.targetPositions;

        // Base rotation speed (slow)
        const time = clock.getElapsedTime();
        pointsRef.current.rotation.y = time * 0.05; // Constant slow rotation

        // Adding a subtle "Breathing" sine wave to the rotation or scale could be cool?
        // Let's keep it simple: Pure Position LERP.

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            let tx = targets[ix];
            let ty = targets[iy];
            let tz = targets[iz];

            // Biological Noise: Add tiny sine wave offset to target?
            // "Natural" -> Particles shouldn't be dead still.
            const noise = Math.sin(time * 0.5 + i * 0.1) * 0.05;
            // Note: Mutating 'targets' in loop is bad if it persists, but we are just reading local vars.
            // Actually, adding noise to the interpolation target creates a "swimming" effect.

            // Standard LERP
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
                opacity={0.65} // Slightly more transparent for "Ghostly/Biological" feel
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
                <ambientLight intensity={0.4} />
                <BiologicalParticles />
            </Canvas>
        </div>
    );
}
