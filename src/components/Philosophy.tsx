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
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">What We Believe</h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <p className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Human potential is not a ceiling.<br/>
                            It's a <span className="text-white font-normal drop-shadow-lg">collaboration surface</span>.
                        </p>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            Advanced intelligence doesn't replace thought—it <span className="text-white font-medium">amplifies intention</span>.
                            We're building systems where humans focus on <em>what should exist</em>, and intelligence handles <em>bringing it into being</em>.
                        </p>
                    </FadeInText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    <div className="space-y-4">
                        <FadeInText delay={0.6}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Context is Everything</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Intelligence without memory is theater. We build systems that understand your entire codebase, business logic, and accumulated knowledge—not just the current prompt.
                            </p>
                        </FadeInText>
                    </div>
                    <div className="space-y-4">
                        <FadeInText delay={0.7}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Agency + Alignment</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Agents that act without oversight are dangerous. Agents that require constant supervision are useless. We research the architecture in between—trustworthy autonomy.
                            </p>
                        </FadeInText>
                    </div>
                    <div className="space-y-4">
                        <FadeInText delay={0.8}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Emergent Capacity</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                One human with the right intelligence layer operates at the level of a team. Ten become an organization. This isn't productivity—it's <span className="text-accent/80 italic">transformation</span>.
                            </p>
                        </FadeInText>
                    </div>
                </div>

                {/* Subtle Project Reference */}
                <div className="pt-16 border-t border-white/[0.03] mt-16">
                    <FadeInText delay={1.0}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                            <p className="text-xs font-mono text-gray-600 tracking-wider">
                                ACTIVE RESEARCH: <span className="text-gray-500">Cortex Intelligence System</span>
                            </p>
                            <p className="text-xs font-mono text-gray-700 italic">
                                Building the infrastructure for what comes next.
                            </p>
                        </div>
                    </FadeInText>
                </div>

            </div>
        </section>
    );
};
