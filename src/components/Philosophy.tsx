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
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">Our Thesis</h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <p className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            The future belongs to those who successfully <span className="text-white font-normal drop-shadow-lg">operationalize intelligence</span>.
                        </p>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            We are building the infrastructure for the next era of work.
                            By moving beyond simple chat interfaces to deep, system-integrated agents, we enable humans to shift from task-execution to <span className="text-white font-medium">strategic direction</span>—unlocking exponential productivity/value.
                        </p>
                    </FadeInText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    <div className="space-y-4">
                        <FadeInText delay={0.6}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Deep Context</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Intelligence is useless without memory. Our systems are designed to ingest, understand, and recall the full context of your codebase and business logic.
                            </p>
                        </FadeInText>
                    </div>
                    <div className="space-y-4">
                        <FadeInText delay={0.7}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Reliable Agency</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Trust is the currency of automation. We research architectures that ensure AI agents act with precision, verify their own work, and fail safely.
                            </p>
                        </FadeInText>
                    </div>
                    <div className="space-y-4">
                        <FadeInText delay={0.8}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Human Leverage</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                We don't replace humans; we scale them. Our goal is to provide every individual with the output capacity of an entire organization.
                            </p>
                        </FadeInText>
                    </div>
                </div>

            </div>
        </section>
    );
};
