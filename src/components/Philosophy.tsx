/**
 * Philosophy.tsx (V1 - Original)
 * 
 * V1: Original version
 * - "What We Believe" / "collaboration surface"
 * - Pillars: Context is Everything, Agency + Alignment, Emergent Capacity
 * 
 * V2: Manifesto-aligned version in PhilosophyV2.tsx
 * - "The Kempion Thesis" / "Complexity is a failure of intelligence"
 * - Pillars: Deep Context, Scenario Forecasting, Strategic Leverage
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

export const Philosophy = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-background relative z-10">
            <div className="max-w-5xl text-center md:text-left space-y-24">

                <div className="space-y-8">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">Our Focus</h3>

                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <p className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            We research and build the most advanced <span className="text-white font-normal drop-shadow-lg">decision intelligence systems</span> to maximize human-AI collaboration.
                        </p>

                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            These tools help individuals and organizations make better choices when situations are complex, information is incomplete, and the costs of being wrong are real.
                            <br /><br />
                            Many AI systems can be fluent without being reliable. Our approach is different: we optimize for provable outcomes, heightened insight, and the enablement of a new era of <span className="text-white font-medium">symbiotic data-driven strategic decision-making</span>.
                        </p>

                    </FadeInText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    <div className="space-y-4">
                        <FadeInText delay={0.6}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Memory</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Persistent and adaptive context (goals, constraints, history, domain knowledge).
                            </p>

                        </FadeInText>
                    </div>
                    <div className="space-y-4">
                        <FadeInText delay={0.7}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Situation Awareness</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Applied intelligence with full perspective, probability bands, and aligned outcomes.
                            </p>

                        </FadeInText>
                    </div>
                    <div className="space-y-4">
                        <FadeInText delay={0.8}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Learning</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Feedback loops that measure prediction vs. outcome and improve over time.
                            </p>

                        </FadeInText>
                    </div>
                </div>

                {/* Subtle Project Reference */}
                <div className="pt-16 border-t border-white/[0.03] mt-16">
                    <FadeInText delay={1.0}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                            <p className="text-lg md:text-xl text-gray-300 font-light text-center md:text-left w-full">
                                Together, these move people from <span className="italic text-white">hoping</span> to <span className="italic text-white">knowing</span>—not by removing uncertainty, but by making it visible, actionable, and measurable.
                            </p>
                        </div>

                    </FadeInText>
                </div>

            </div>
        </section>
    );
};
