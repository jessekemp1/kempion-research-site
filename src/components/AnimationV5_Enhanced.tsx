import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 6000;
const CUBE_SIZE = 7.0;
const SPHERE_RADIUS = 3.8;
const PARTICLE_SIZE = 0.05;

// Physics Constants
const SPRING_STRENGTH = 0.08;
const DAMPING = 0.92;
const MOUSE_FORCE = 1.5;
const MOUSE_RADIUS_SQ = 16.0;

interface ShockwaveState {
  x: number;
  y: number;
  strength: number;
}

const EnhancedParticles = ({ scrollVelocity, shockwave }: {
  scrollVelocity: React.MutableRefObject<number>;
  shockwave: ShockwaveState;
}) => {
    const pointsRef = useRef<THREE.Points>(null!);
    const { pointer, viewport } = useThree();

    // --- 1. Data Generation (Cloud, Sphere, Cube targets) ---
    const { cloudPos, spherePos, cubePos, initialPos } = useMemo(() => {
        const cPos = new Float32Array(PARTICLE_COUNT * 3); // Cloud
        const sPos = new Float32Array(PARTICLE_COUNT * 3); // Sphere
        const kPos = new Float32Array(PARTICLE_COUNT * 3); // Cube
        const iPos = new Float32Array(PARTICLE_COUNT * 3); // Initial

        const side = Math.cbrt(PARTICLE_COUNT);
        const step = CUBE_SIZE / side;
        let i = 0;

        for (let x = 0; x < side; x++) {
            for (let y = 0; y < side; y++) {
                for (let z = 0; z < side; z++) {
                    if (i >= PARTICLE_COUNT) break;

                    // Cube Target
                    kPos[i * 3] = (x - side / 2) * step + (Math.random() - 0.5) * 0.2;
                    kPos[i * 3 + 1] = (y - side / 2) * step + (Math.random() - 0.5) * 0.2;
                    kPos[i * 3 + 2] = (z - side / 2) * step + (Math.random() - 0.5) * 0.2;

                    // Sphere Target (Fibonacci sphere distribution)
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const radius = SPHERE_RADIUS + (Math.random() - 0.5) * 0.3;

                    sPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    sPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    sPos[i * 3 + 2] = radius * Math.cos(phi);

                    // Cloud Target (Wide dispersal)
                    cPos[i * 3] = (Math.random() - 0.5) * 40;
                    cPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
                    cPos[i * 3 + 2] = (Math.random() - 0.5) * 20;

                    // Start at cloud
                    iPos[i * 3] = cPos[i * 3];
                    iPos[i * 3 + 1] = cPos[i * 3 + 1];
                    iPos[i * 3 + 2] = cPos[i * 3 + 2];

                    i++;
                }
            }
        }

        // Fill remainder
        while (i < PARTICLE_COUNT) {
            kPos[i * 3] = (Math.random() - 0.5) * CUBE_SIZE;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = SPHERE_RADIUS;
            sPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            sPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            sPos[i * 3 + 2] = radius * Math.cos(phi);

            cPos[i * 3] = (Math.random() - 0.5) * 30;
            cPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            cPos[i * 3 + 2] = (Math.random() - 0.5) * 20;

            iPos[i * 3] = cPos[i * 3];
            iPos[i * 3 + 1] = cPos[i * 3 + 1];
            iPos[i * 3 + 2] = cPos[i * 3 + 2];
            i++;
        }

        return { cloudPos: cPos, spherePos: sPos, cubePos: kPos, initialPos: iPos };
    }, []);

    // --- 2. Simulation State ---
    const state = useRef({
        velocities: new Float32Array(PARTICLE_COUNT * 3),
        speeds: new Float32Array(PARTICLE_COUNT), // For velocity-based effects
        mixFactor: 0, // 0 = Cloud, 1 = Sphere, 2 = Cube
        targetMix: 0,
        currentShockwave: { x: 0, y: 0, strength: 0 },
    });

    // --- 3. Animation Cycle: Cloud → Sphere → Cube → Cloud ---
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const loop = () => {
            const s = state.current;

            if (s.targetMix === 0) {
                // At Cloud → Go to Sphere
                timeout = setTimeout(() => {
                    s.targetMix = 1;
                    loop();
                }, 3000);
            } else if (s.targetMix === 1) {
                // At Sphere → Go to Cube
                timeout = setTimeout(() => {
                    s.targetMix = 2;
                    loop();
                }, 6000);
            } else {
                // At Cube → Go to Cloud
                timeout = setTimeout(() => {
                    s.targetMix = 0;
                    loop();
                }, 8000);
            }
        };

        loop();
        return () => clearTimeout(timeout);
    }, []);

    // --- 4. Update shockwave from parent ---
    useEffect(() => {
        if (shockwave.strength > 0) {
            state.current.currentShockwave = { ...shockwave };
        }
    }, [shockwave]);

    // --- 5. Physics Loop ---
    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        const s = state.current;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const vels = s.velocities;

        // Smooth mix factor transition
        const mixSpeed = delta * 0.5;
        if (s.mixFactor < s.targetMix) {
            s.mixFactor = Math.min(s.mixFactor + mixSpeed, s.targetMix);
        } else if (s.mixFactor > s.targetMix) {
            s.mixFactor = Math.max(s.mixFactor - mixSpeed, s.targetMix);
        }

        // Mouse world position
        const mouseX = (pointer.x * viewport.width) / 2;
        const mouseY = (pointer.y * viewport.height) / 2;

        // Scroll velocity turbulence
        const turbulence = scrollVelocity.current;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;

            // Calculate target based on three-way blend
            let tx, ty, tz;

            if (s.mixFactor <= 1.0) {
                // Blend between Cloud (0) and Sphere (1)
                const t = s.mixFactor;
                tx = cloudPos[ix] + (spherePos[ix] - cloudPos[ix]) * t;
                ty = cloudPos[iy] + (spherePos[iy] - cloudPos[iy]) * t;
                tz = cloudPos[iz] + (spherePos[iz] - cloudPos[iz]) * t;
            } else {
                // Blend between Sphere (1) and Cube (2)
                const t = s.mixFactor - 1.0;
                tx = spherePos[ix] + (cubePos[ix] - spherePos[ix]) * t;
                ty = spherePos[iy] + (cubePos[iy] - spherePos[iy]) * t;
                tz = spherePos[iz] + (cubePos[iz] - spherePos[iz]) * t;
            }

            // Spring force
            const fx = (tx - positions[ix]) * SPRING_STRENGTH;
            const fy = (ty - positions[iy]) * SPRING_STRENGTH;
            const fz = (tz - positions[iz]) * SPRING_STRENGTH;

            vels[ix] += fx;
            vels[iy] += fy;
            vels[iz] += fz;

            // Mouse repulsion with Z-depth weighting
            const dx = positions[ix] - mouseX;
            const dy = positions[iy] - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < MOUSE_RADIUS_SQ) {
                const dist = Math.sqrt(distSq);
                // Closer particles (higher Z) react more
                const zFactor = 1.0 - Math.min(Math.abs(positions[iz]) / 10.0, 0.7);
                const force = ((4.0 - dist) * MOUSE_FORCE * delta) * (0.3 + zFactor * 0.7);

                vels[ix] += (dx / dist) * force;
                vels[iy] += (dy / dist) * force;
            }

            // Click shockwave
            if (s.currentShockwave.strength > 0.1) {
                const shockDx = positions[ix] - s.currentShockwave.x;
                const shockDy = positions[iy] - s.currentShockwave.y;
                const shockDist = Math.sqrt(shockDx * shockDx + shockDy * shockDy);

                if (shockDist < 15) {
                    const shockForce = (s.currentShockwave.strength / (shockDist + 1)) * 0.3;
                    vels[ix] += (shockDx / (shockDist + 0.1)) * shockForce;
                    vels[iy] += (shockDy / (shockDist + 0.1)) * shockForce;
                }
            }

            // Scroll velocity turbulence
            if (turbulence > 0.01) {
                vels[ix] += (Math.random() - 0.5) * turbulence * 0.05;
                vels[iy] += (Math.random() - 0.5) * turbulence * 0.05;
                vels[iz] += (Math.random() - 0.5) * turbulence * 0.03;
            }

            // Apply damping
            vels[ix] *= DAMPING;
            vels[iy] *= DAMPING;
            vels[iz] *= DAMPING;

            // Update position
            positions[ix] += vels[ix];
            positions[iy] += vels[iy];
            positions[iz] += vels[iz];

            // Track speed for velocity-based effects
            s.speeds[i] = Math.sqrt(vels[ix]**2 + vels[iy]**2 + vels[iz]**2);
        }

        // Decay shockwave
        if (s.currentShockwave.strength > 0) {
            s.currentShockwave.strength *= 0.92;
        }

        // Decay scroll turbulence
        scrollVelocity.current *= 0.9;

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Slow rotation
        pointsRef.current.rotation.y += delta * 0.04;
    });

    // Custom material with velocity-based opacity
    const material = useMemo(() => {
        return new THREE.PointsMaterial({
            size: PARTICLE_SIZE,
            color: new THREE.Color('#00aaff'),
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });
    }, []);

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
            <primitive object={material} attach="material" />
        </points>
    );
};

export default function AnimationV5_Enhanced() {
    const scrollVelocity = useRef(0);
    const lastScrollY = useRef(0);
    const [shockwave, setShockwave] = useState<ShockwaveState>({ x: 0, y: 0, strength: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    // Track scroll velocity
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = Math.abs(currentY - lastScrollY.current);
            scrollVelocity.current = Math.min(delta * 0.1, 2.0);
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle click shockwave
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Convert to viewport coordinates (approximate)
        const viewportX = x * 7;
        const viewportY = y * 4;

        setShockwave({ x: viewportX, y: viewportY, strength: 8.0 });
    };

    return (
        <div
            ref={canvasRef}
            onClick={handleClick}
            style={{
                width: '100%',
                height: '100vh',
                background: 'radial-gradient(circle at center, #0a1a2a 0%, #000000 100%)',
                cursor: 'pointer'
            }}
        >
            <Canvas camera={{ position: [0, 0, 14], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <EnhancedParticles scrollVelocity={scrollVelocity} shockwave={shockwave} />
            </Canvas>
        </div>
    );
}
