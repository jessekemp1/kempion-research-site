import { useEffect, useRef } from 'react';

export const AnimationV1_Fluid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let time = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Deep atmospheric background layer mostly handled by CSS, 
            // but we add subtle moving interference patterns here.

            const layers = 5; // More layers

            for (let i = 0; i < layers; i++) {
                ctx.beginPath();

                // Faster time
                const t = time * 0.001 + (i * 100);

                // Gradient for each wave - More distinct colors
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                // Using distinct blues/cyans for visibility
                gradient.addColorStop(0, `rgba(6, 182, 212, ${0.05 + (i * 0.01)})`); // Cyan-ish
                gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.08 + (i * 0.01)})`); // Blue-ish
                gradient.addColorStop(1, `rgba(6, 182, 212, ${0.05 + (i * 0.01)})`);

                ctx.fillStyle = gradient;

                // Draw Sine Waves
                ctx.moveTo(0, height);

                for (let x = 0; x <= width; x += 5) { // Higher resolution
                    // Complex interference pattern - Higher amplitude
                    const y1 = Math.sin(x * 0.002 + t) * 150;
                    const y2 = Math.sin(x * 0.003 - t * 0.5) * 80;
                    const y3 = Math.sin(x * 0.01 + t * 2) * 40; // High freq detail

                    const y = (height / 2) + y1 + y2 + y3 + (i * 30);
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.fill();
            }

            time += 15; // Increased Speed significantly
            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen"
        />
    );
};
