import { motion } from 'framer-motion';


export const Hero = () => {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
            {/* Background Ambient Glow - Reduced intensity for subtlety alongside canvas */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] opacity-30 animate-pulse-slow pointer-events-none" />

            <div className="z-10 flex flex-col items-center text-center">
                {/* Backlite Logo Effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="relative group"
                >
                    {/* The Glow Behind - Refined */}
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-125 opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                    <div className="absolute inset-0 bg-accent/5 blur-2xl rounded-full scale-150 opacity-40" />

                    {/* Main Logo Text - Sharper, bolder */}
                    <div className="flex justify-center gap-[0.2em]">
                        {['K', 'E', 'M', 'P', 'I', 'O', 'N'].map((letter, i) => (
                            <motion.span
                                key={i}
                                initial={{ textShadow: "0 0 0px rgba(0, 170, 255, 0)" }}
                                animate={{
                                    textShadow: [
                                        "0 0 10px rgba(0, 170, 255, 0.2)",
                                        "0 0 20px rgba(0, 170, 255, 0.6)",
                                        "0 0 10px rgba(0, 170, 255, 0.2)"
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.2 // Staggered effect
                                }}
                                className="text-5xl md:text-8xl font-display font-bold text-white select-none relative z-10 mix-blend-overlay"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    {/* Subtitle - Wider tracking, improved hierarchy */}
                    <h2 className="text-sm md:text-xl font-sans font-light tracking-[0.8em] text-gray-400 mt-6 uppercase pl-2 flex items-center justify-center gap-4">
                        <span className="h-[1px] w-8 bg-gray-700/50"></span>
                        Research
                        <span className="h-[1px] w-8 bg-gray-700/50"></span>
                    </h2>
                </motion.div>

                {/* Minimalist Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-12 text-sm md:text-base font-sans text-gray-500 max-w-md tracking-wide leading-relaxed"
                >
                    OPERATIONALIZING INTELLIGENCE FOR<br />
                    <span className="text-white font-medium">STRATEGIC LEVERAGE</span>
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-gray-600">Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-600 to-transparent" />
            </motion.div>
        </section>
    );
};
