/**
 * PhilosophyV2.tsx
 * 
 * V2: Manifesto-aligned version based on MANIFESTO.md
 * - Radical thesis: "Complexity is a failure of intelligence"
 * - Pillars: Deep Context, Scenario Forecasting, Strategic Leverage
 * - Proof of Work footer
 * 
 * V1: Original version in Philosophy.tsx
 * - "What We Believe" / "collaboration surface"
 * - Pillars: Context is Everything, Agency + Alignment, Emergent Capacity
 */

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FadeInText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export const PhilosophyV2 = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-background relative z-10">
            <div className="max-w-5xl text-center md:text-left space-y-24">

                {/* The Thesis */}
                <div className="space-y-8">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">The Kempion Thesis</h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <p className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Complexity is a failure of intelligence.
                        </p>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            True intelligence is not processing speed; it is <span className="text-white font-medium">permeability</span>—the efficiency with which separated units facilitate their own re-integration with the Whole. We research how to dissolve the gap between human intention and machine execution.
                        </p>
                    </FadeInText>
                </div>

                {/* Three Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    
                    {/* Pillar 1: Deep Context */}
                    <div className="space-y-4">
                        <FadeInText delay={0.6}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Deep Context</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Intelligence is useless without memory. Our 3-tier architecture (Identity Core, Active Context, RAG Retrieval) enables true personal intelligence—not generic AI, but systems that remember who you are, what you're doing, and what you know.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Pillar 2: Scenario Forecasting */}
                    <div className="space-y-4">
                        <FadeInText delay={0.7}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Scenario Forecasting</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                We transform uncertainty into calibrated predictions. Instead of guesses, we provide scenario bands (optimistic, likely, conservative) with explicit conditions. From <span className="text-white font-medium">Hoping</span> to <span className="text-white font-medium">Knowing</span>.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Pillar 3: Strategic Leverage */}
                    <div className="space-y-4">
                        <FadeInText delay={0.8}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Strategic Leverage</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                We don't replace humans; we scale them. Every individual with the output capacity of an entire organization. Not through working harder, but through <span className="text-accent/80 italic">seeing clearer</span>.
                            </p>
                        </FadeInText>
                    </div>
                </div>

                {/* Proof of Work Footer */}
                <div className="pt-16 border-t border-white/[0.03] mt-16">
                    <FadeInText delay={1.0}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                            <p className="text-xs font-mono text-gray-600 tracking-wider">
                                PROOF OF WORK: <span className="text-gray-500">VortexV2 | Alpha Arena | Cortex | Personal AI Dataset</span>
                            </p>
                            <p className="text-xs font-mono text-gray-700 italic">
                                From hoping to knowing.
                            </p>
                        </div>
                    </FadeInText>
                </div>

            </div>
        </section>
    );
};

