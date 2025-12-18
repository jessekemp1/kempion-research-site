import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 4000;
const RESPONSE_RADIUS = 2.5;
const REPEL_FORCE = 0.1;
const MORPH_SPEED = 0.005;     // Very slow shift between forms

// --- Geometry Generators ---
// Returns Float32Array of [x, y, z, x, y, z...]
const getRandomCloud = (count: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Increased spread for "Burst" effect
        positions[i * 3] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
};

const getSphere = (count: number, radius: number) => {
    const positions = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2; // y from 1 to -1
        const r = Math.sqrt(1 - y * y);      // radius at y
        const theta = phi * i;               // angle
        positions[i * 3] = Math.cos(theta) * r * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return positions;
};

const getCube = (count: number, size: number) => {
    const positions = new Float32Array(count * 3);
    const side = Math.cbrt(count);
    const step = size / side;
    let i = 0;
    for (let x = 0; x < side; x++) {
        for (let y = 0; y < side; y++) {
            for (let z = 0; z < side; z++) {
                if (i >= count) break;
                positions[i * 3] = (x - side / 2) * step;
                positions[i * 3 + 1] = (y - side / 2) * step;
                positions[i * 3 + 2] = (z - side / 2) * step;
                i++;
            }
        }
    }
    // Fill rest randomly if non-perfect cube count
    while (i < count) {
        positions[i * 3] = (Math.random() - 0.5) * size;
        positions[i * 3 + 1] = (Math.random() - 0.5) * size;
        positions[i * 3 + 2] = (Math.random() - 0.5) * size;
        i++;
    }
    return positions;
};

const Particles = () => {
    const points = useRef<THREE.Points>(null!);
    const { pointer, viewport } = useThree();

    // Generate geometries
    const [shapes] = useState(() => ({
        cloud: getRandomCloud(PARTICLE_COUNT),
        sphere: getSphere(PARTICLE_COUNT, 4),
        cube: getCube(PARTICLE_COUNT, 6),
    }));

    // Start as CUBE
    const [targetShape, setTargetShape] = useState<'cloud' | 'sphere' | 'cube'>('cube');

    // Create initial buffers
    const [currentPositions] = useState(() => new Float32Array(shapes.cube)); // Start showing Cube
    const [velocities] = useState(() => new Float32Array(PARTICLE_COUNT * 3)); // For physics

    // Cycle forms every few seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTargetShape(prev => {
                // Sequence: Cube -> Sphere -> Cloud (Burst) -> Cube
                if (prev === 'cube') return 'sphere';
                if (prev === 'sphere') return 'cloud';
                return 'cube';
            });
        }, 6000); // Faster pacing (6s)
        return () => clearInterval(interval);
    }, []);

    useFrame(() => {
        if (!points.current) return;

        const targetPositions = shapes[targetShape];
        const positions = points.current.geometry.attributes.position.array as Float32Array;

        // Mouse to world coords (roughly)
        const mouseX = (pointer.x * viewport.width) / 2;
        const mouseY = (pointer.y * viewport.height) / 2;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx = i * 3;

            // 1. Morph Logic: Linear interpolation to target shape
            // Calculate vector to target
            const tx = targetPositions[idx];
            const ty = targetPositions[idx + 1];
            const tz = targetPositions[idx + 2];

            // We apply a "homing force" towards the target position
            // instead of hard lerp for physics compatibility
            const homeX = tx - positions[idx];
            const homeY = ty - positions[idx + 1];
            const homeZ = tz - positions[idx + 2];

            velocities[idx] += homeX * MORPH_SPEED; // Pull to target
            velocities[idx + 1] += homeY * MORPH_SPEED;
            velocities[idx + 2] += homeZ * MORPH_SPEED;

            // 2. Physics: Repulsion from mouse
            const dx = positions[idx] - mouseX;
            const dy = positions[idx + 1] - mouseY;
            // Simple Z plane interaction for mouse effect
            const distSq = dx * dx + dy * dy;

            if (distSq < RESPONSE_RADIUS * RESPONSE_RADIUS) {
                const dist = Math.sqrt(distSq);
                const force = (RESPONSE_RADIUS - dist) / RESPONSE_RADIUS;
                const angle = Math.atan2(dy, dx);

                velocities[idx] += Math.cos(angle) * force * REPEL_FORCE;
                velocities[idx + 1] += Math.sin(angle) * force * REPEL_FORCE;
                // Add some Z perturbance
                velocities[idx + 2] += (Math.random() - 0.5) * force * REPEL_FORCE;
            }

            // 3. Damping (Friction)
            velocities[idx] *= 0.92;
            velocities[idx + 1] *= 0.92;
            velocities[idx + 2] *= 0.92;

            // 4. Apply Velocity
            positions[idx] += velocities[idx];
            positions[idx + 1] += velocities[idx + 1];
            positions[idx + 2] += velocities[idx + 2];
        }

        points.current.geometry.attributes.position.needsUpdate = true;
        // Slow rotation
        points.current.rotation.y += 0.001;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={currentPositions.length / 3}
                    array={currentPositions}
                    itemSize={3}
                    args={[currentPositions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={0.06}
                color="#00aaff"
                sizeAttenuation
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// ... (Keeping imports)

// ... (Keeping random generation functions)

export default function AnimationV2_Morphing() {
    // ... implementation
    // I need to view this one too to be safe.
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #1a2a3a 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <Particles />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            </Canvas>
        </div>
    );
}
