import { motion } from 'framer-motion';
import { FluidBackground } from './FluidBackground';

export const Hero = () => {
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
            <FluidBackground />

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
                    <h1 className="text-5xl md:text-8xl font-display font-bold tracking-[0.1em] text-white select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] relative z-10 mix-blend-overlay">
                        KEMPION
                    </h1>

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
