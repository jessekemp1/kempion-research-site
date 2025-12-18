import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 6000;
const CUBE_SIZE = 7.0;

// States
type AnimState = 'CLOUD' | 'CONDENSING' | 'CUBE' | 'EXPANDING';

const SandParticles = () => {
    const points = useRef<THREE.Points>(null!);
    const { pointer, viewport } = useThree();

    // --- Data Generation ---
    const { cloudPos, cubePos, velocities } = useMemo(() => {
        const cPos = new Float32Array(PARTICLE_COUNT * 3);
        const kPos = new Float32Array(PARTICLE_COUNT * 3);
        const vels = new Float32Array(PARTICLE_COUNT * 3); // For expansion drift

        const side = Math.cbrt(PARTICLE_COUNT);
        const step = CUBE_SIZE / side;
        let i = 0;

        // Cube & Cloud positions
        for (let x = 0; x < side; x++) {
            for (let y = 0; y < side; y++) {
                for (let z = 0; z < side; z++) {
                    if (i >= PARTICLE_COUNT) break;

                    // Cube
                    kPos[i * 3] = (x - side / 2) * step + (Math.random() - 0.5) * 0.1;
                    kPos[i * 3 + 1] = (y - side / 2) * step + (Math.random() - 0.5) * 0.1;
                    kPos[i * 3 + 2] = (z - side / 2) * step + (Math.random() - 0.5) * 0.1;

                    // Cloud (Initial wide spread)
                    cPos[i * 3] = (Math.random() - 0.5) * 35;
                    cPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
                    cPos[i * 3 + 2] = (Math.random() - 0.5) * 35;

                    // Expansion Velocities (Drift outwards)
                    const vx = (Math.random() - 0.5);
                    const vy = (Math.random() - 0.5);
                    const vz = (Math.random() - 0.5);
                    // Normalize and scale
                    const mag = Math.sqrt(vx * vx + vy * vy + vz * vz);
                    vels[i * 3] = (vx / mag) * (0.5 + Math.random()); // Random speed
                    vels[i * 3 + 1] = (vy / mag) * (0.5 + Math.random());
                    vels[i * 3 + 2] = (vz / mag) * (0.5 + Math.random());

                    i++;
                }
            }
        }
        // Fill remainder
        while (i < PARTICLE_COUNT) {
            kPos[i * 3] = (Math.random() - 0.5) * CUBE_SIZE; // Fallback
            cPos[i * 3] = (Math.random() - 0.5) * 35;
            i++;
        }
        return { cloudPos: cPos, cubePos: kPos, velocities: vels };
    }, []);

    const [phase, setPhase] = useState<AnimState>('CLOUD');
    // const [rotationSpeed, setRotationSpeed] = useState(0.2); // Removed unused state

    // Simulation Refs
    // We modify the buffer attribute directly.
    // Keeping this ref for potential future logic reference.
    const _currentPositions = useRef(new Float32Array(cloudPos)); // Start at cloud
    void _currentPositions; // Suppress unused warning

    // Cycle Logic
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const cycle = () => {
            if (phase === 'CLOUD') {
                // Wait briefly then condense
                timeout = setTimeout(() => setPhase('CONDENSING'), 1000);
            } else if (phase === 'CONDENSING') {
                // Slow condense takes a while, let's give it fixed time to mostly arrive
                timeout = setTimeout(() => setPhase('CUBE'), 5000); // 5s slow condense
            } else if (phase === 'CUBE') {
                // Hold for half rotation. 
                // At 0.4 rad/s (slowed down), half rotation (PI = 3.14) takes ~8s
                timeout = setTimeout(() => setPhase('EXPANDING'), 8000);
            } else if (phase === 'EXPANDING') {
                // Slow expand for a while
                timeout = setTimeout(() => setPhase('CLOUD'), 6000); // 6s drift
            }
        };

        cycle();
        return () => clearTimeout(timeout);
    }, [phase]);

    useFrame((_state, delta) => {
        if (!points.current) return;

        const posAttr = points.current.geometry.attributes.position;
        const positions = posAttr.array as Float32Array;

        // Mouse Interaction calc
        // Convert pointer (NDC) to local coords roughly? 
        // Or just map pointer x/y to a range since camera is fixed.
        // Camera at z=14. At z=0, viewport width is visible.
        const mouseX = (pointer.x * viewport.width) / 2;
        const mouseY = (pointer.y * viewport.height) / 2;

        // Rotate the entire group slowly for background feel
        // AND rotate the cube specifically in CUBE phase?
        // Let's just rotate the container.
        if (phase === 'CUBE') {
            points.current.rotation.y += delta * 0.4;
        } else {
            points.current.rotation.y += delta * 0.05; // Continual slow drift
        }

        const repulsionRadius = 4.0;
        const repulsionForce = 5.0;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            let px = positions[ix];
            let py = positions[ix + 1];
            let pz = positions[ix + 2];

            // TARGET LOGIC
            let tx = px, ty = py, tz = pz; // Default to stay put

            if (phase === 'CONDENSING') {
                // Lerp to Cube
                tx = cubePos[ix];
                ty = cubePos[ix + 1];
                tz = cubePos[ix + 2];
                const speed = 0.8 * delta; // SLOW condense
                px += (tx - px) * speed;
                py += (ty - py) * speed;
                pz += (tz - pz) * speed;
            }
            else if (phase === 'CUBE') {
                // Stick to cube (with wobble)
                tx = cubePos[ix];
                ty = cubePos[ix + 1];
                tz = cubePos[ix + 2];
                // Tighter hold
                const speed = 2.0 * delta;
                px += (tx - px) * speed;
                py += (ty - py) * speed;
                pz += (tz - pz) * speed;
            }
            else if (phase === 'EXPANDING') {
                // Drift outwards using pre-calc velocities
                // "Float across screen"
                px += velocities[ix] * delta * 2.0;
                py += velocities[ix + 1] * delta * 2.0;
                pz += velocities[ix + 2] * delta * 2.0;

                // Also slowly return to Cloud start positions? 
                // No, just drift. 'CLOUD' phase will reset/lerp them back.
            }
            else if (phase === 'CLOUD') {
                // Lerp back to random cloud positions to reset for next condense
                tx = cloudPos[ix];
                ty = cloudPos[ix + 1];
                tz = cloudPos[ix + 2];
                const speed = 1.0 * delta;
                px += (tx - px) * speed;
                py += (ty - py) * speed;
                pz += (tz - pz) * speed;
            }

            // MOUSE INTERACTION (Repulsion)
            // We need world coordinates for accurate interaction, 
            // but since we rotate the object, local coords are rotated.
            // Simplified: Assume mouse acts on the unrotated projection or untransform mouse?
            // Let's just use raw x/y dist ignoring rotation for a "force field" effect relative to screen center
            // (This is a cheap hack that feels fine usually)

            // Correct way: Project particle to world, measure dist to mouse ray.
            // Fast way: Just check x/y relative to center if rotation wasn't huge. 
            // Better: Untransform mouse into local space? 
            // Let's keep it simple: Repel from world space mouse.
            // We need to apply force to px,py,pz (local).

            // Vector valid logic:
            // WorldPos = positions[i].applyMatrix4(points.current.matrixWorld)
            // But doing this for 6000 particles is heavy in JS.
            // Let's do a simple radial rejection from (0,0) modulated by mouse?
            // Actually, let's just create a disturbance if close to (mouseX, mouseY) in raw coords
            // It will feel "magnetic" even if not perfectly aligned physically.

            // To make it distinct, let's only do it if close
            const dx = px - mouseX; // This ignores rotation! 
            const dy = py - mouseY;
            // z ignored for 2D mouse plane interaction
            const distSq = dx * dx + dy * dy;

            if (distSq < repulsionRadius * repulsionRadius) {
                const dist = Math.sqrt(distSq);
                const force = (1.0 - dist / repulsionRadius) * repulsionForce * delta;
                // Push away
                const angle = Math.atan2(dy, dx);
                px += Math.cos(angle) * force;
                py += Math.sin(angle) * force;
            }

            positions[ix] = px;
            positions[ix + 1] = py;
            positions[ix + 2] = pz;
        }

        posAttr.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={cloudPos.length / 3}
                    array={new Float32Array(cloudPos)}
                    itemSize={3}
                    args={[new Float32Array(cloudPos), 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={0.04}
                color="#00aaff"
                sizeAttenuation
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default function AnimationV3_SandCube() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #0a1a2a 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 14], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <SandParticles />
            </Canvas>
        </div>
    );
}
