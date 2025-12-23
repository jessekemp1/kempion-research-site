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
const INNER_SPHERE_RADIUS = 3.0;

// Event Horizon Dimensions
const EH_INNER_RADIUS = 2.5;
const EH_OUTER_RADIUS = 9.0;

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


const BiologicalParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    // --- Data ---
    const { cloudPos, voidSpherePos, flowPos, eventHorizonPos, initialPos, colors, sizes } = useMemo(() => {
        const c = getCloud(PARTICLE_COUNT);
        const vs = getVoidSphere(PARTICLE_COUNT);
        const flow = getFlowPast(PARTICLE_COUNT);
        const eh = getEventHorizon(PARTICLE_COUNT);
        const init = new Float32Array(c);

        // Colors & Sizes
        const cols = new Float32Array(PARTICLE_COUNT * 3);
        const sz = new Float32Array(PARTICLE_COUNT);
        const color1 = new THREE.Color("#00aaff"); // Standard Blue
        const color2 = new THREE.Color("#b3ecff"); // Bright Cyan/White

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // 15% Bright/Hot particles
            const isBright = Math.random() > 0.85;
            const col = isBright ? color2 : color1;

            cols[i * 3] = col.r;
            cols[i * 3 + 1] = col.g;
            cols[i * 3 + 2] = col.b;

            // Bright ones are slightly larger
            sz[i] = isBright ? (0.04 + Math.random() * 0.04) : (0.02 + Math.random() * 0.02);
        }

        return { cloudPos: c, voidSpherePos: vs, flowPos: flow, eventHorizonPos: eh, initialPos: init, colors: cols, sizes: sz };
    }, []);

    // --- State ---
    const state = useRef({
        targetPositions: cloudPos, // Default start
        phase: 'cloud'
    });

    // --- Scroll Handler ---
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const h = window.innerHeight;
            const docH = document.documentElement.scrollHeight;
            const progress = y / (docH - h); // 0 to 1

            // Scroll Logic Mapping
            // 0.0 - 0.15: CLOUD (Intro)
            // 0.15 - 0.40: EVENT HORIZON (Concentration)
            // 0.40 - 0.70: VOID SPHERE (Structure)
            // 0.70 - 1.00: FLOW PAST (Immersion)

            if (progress < 0.15) {
                state.current.targetPositions = cloudPos;
            } else if (progress < 0.40) {
                state.current.targetPositions = eventHorizonPos;
            } else if (progress < 0.70) {
                state.current.targetPositions = voidSpherePos;
            } else {
                state.current.targetPositions = flowPos;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [cloudPos, eventHorizonPos, voidSpherePos, flowPos]);

    // --- Render Loop ---
    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const targets = s.targetPositions;

        const time = clock.getElapsedTime();
        pointsRef.current.rotation.y = time * 0.03; // Slower global rotation

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            let tx = targets[ix];
            let ty = targets[iy];
            let tz = targets[iz];

            // Noise for "Biological" feel
            const noise = Math.sin(time * 0.5 + i * 0.1) * 0.05;

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
                size={0.035} // Base size
                vertexColors
                sizeAttenuation
                transparent
                opacity={0.8}
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
