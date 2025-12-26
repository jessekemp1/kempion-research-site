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

export const Capabilities = () => {
    return (
        <section className="w-full pb-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10">
            <div className="max-w-5xl text-left space-y-16">

                {/* Intro */}
                <FadeInText>
                    <div className="max-w-2xl">
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-6">Core Capabilities</h3>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                            We integrate three interconnected capabilities that transform predictions into actionable judgment:
                        </p>
                    </div>
                </FadeInText>

                {/* The Three Capabilities */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-white/5">

                    {/* Memory */}
                    <div className="space-y-4">
                        <FadeInText delay={0.2}>
                            <div className="h-0.5 w-12 bg-accent/60 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Memory</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Persistent, adaptive context incorporating goals, constraints, history, and domain knowledge.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Scenario Bands */}
                    <div className="space-y-4">
                        <FadeInText delay={0.3}>
                            <div className="h-0.5 w-12 bg-accent/60 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Scenario Bands</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Explicit uncertainty modeling with optimistic, likely, and conservative ranges—revealing the conditions that shift forecasts.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Learning */}
                    <div className="space-y-4">
                        <FadeInText delay={0.4}>
                            <div className="h-0.5 w-12 bg-accent/60 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Learning</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Continuous feedback loops that compare predictions to real outcomes, improving calibration over time.
                            </p>
                        </FadeInText>
                    </div>
                </div>

                {/* Conclusion */}
                <div className="pt-12">
                    <FadeInText delay={0.6}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            Together, these move users from <span className="text-white italic">hoping</span> to <span className="text-white italic">knowing</span>—not by eliminating uncertainty, but by making it <span className="text-white/90">visible</span>, <span className="text-white/90">actionable</span>, and <span className="text-white/90">measurable</span>.
                        </p>
                    </FadeInText>
                </div>

            </div>
        </section>
    );
};
