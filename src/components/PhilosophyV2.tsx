/**
 * PhilosophyV2.tsx
 * 
 * V2: Public-manifesto-aligned version based on MANIFESTO.md (v2.0)
 * - Headline: "Make Better Decisions Under Uncertainty"
 * - Subline: "Calibrated decision intelligence with memory, scenario bands, and learning."
 * - Pillars: Memory, Scenario Bands, Learning (Calibration)
 * - Proof of Work footer
 * 
 * V1: Original version in Philosophy.tsx
 * - "What We Believe" / "collaboration surface"
 * - Pillars: Context is Everything, Agency + Alignment, Emergent Capacity
 */

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const BREACH_PARTICLES: Array<{
    left: string;
    sizePx: number;
    delaySec: number;
    durationSec: number;
}> = [
    { left: '8%', sizePx: 2, delaySec: 0.1, durationSec: 4.2 },
    { left: '14%', sizePx: 3, delaySec: 1.0, durationSec: 5.4 },
    { left: '22%', sizePx: 2, delaySec: 2.2, durationSec: 4.8 },
    { left: '31%', sizePx: 4, delaySec: 0.6, durationSec: 6.0 },
    { left: '39%', sizePx: 2, delaySec: 1.8, durationSec: 5.2 },
    { left: '47%', sizePx: 3, delaySec: 2.9, durationSec: 5.8 },
    { left: '56%', sizePx: 2, delaySec: 0.3, durationSec: 4.6 },
    { left: '63%', sizePx: 3, delaySec: 1.4, durationSec: 5.6 },
    { left: '71%', sizePx: 2, delaySec: 2.6, durationSec: 4.9 },
    { left: '78%', sizePx: 4, delaySec: 0.9, durationSec: 6.2 },
    { left: '86%', sizePx: 2, delaySec: 2.1, durationSec: 5.1 },
    { left: '92%', sizePx: 3, delaySec: 1.7, durationSec: 5.9 },
];

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
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10 overflow-hidden">
            {/* Translucent panel so the background animation subtly reads through */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Lighter glass so motion is visible behind text */}
                <div className="absolute inset-0 bg-[rgba(5,5,5,0.50)] backdrop-blur-[1px]" />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgba(0,0,0,0.35)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(0,0,0,0.35)] to-transparent" />
            </div>

            {/* Particle "breach" at the top boundary (very subtle) */}
            <div className="absolute inset-x-0 top-0 h-40 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                {BREACH_PARTICLES.map((p, idx) => (
                    <span
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                        className="kempion-breach-particle"
                        style={{
                            left: p.left,
                            width: `${p.sizePx}px`,
                            height: `${p.sizePx}px`,
                            animationDelay: `${p.delaySec}s`,
                            animationDuration: `${p.durationSec}s`,
                            opacity: 0.18,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-5xl text-center md:text-left space-y-24">

                {/* The Thesis */}
                <div className="space-y-8">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">
                            Decision Intelligence Research
                        </h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <p className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Intelligence measured by outcomes, not confidence.
                        </p>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            We build decision systems that remember context, show uncertainty honestly, and learn from results.
                        </p>
                    </FadeInText>
                    <FadeInText delay={0.55}>
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-3xl">
                            Most AI is fluent but unreliable. Our systems optimize for calibration:
                            when we say 70% likely, it happens 70% of the time.
                        </p>
                    </FadeInText>
                </div>

                {/* Three Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">

                    {/* Pillar 1: Memory */}
                    <div className="space-y-4">
                        <FadeInText delay={0.6}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Memory</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Goals, constraints, history, and domain knowledge persist across decisions. No amnesia.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Pillar 2: Scenario Bands */}
                    <div className="space-y-4">
                        <FadeInText delay={0.7}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Scenario Bands</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Optimistic, likely, and conservative ranges. Plus the conditions that would shift the forecast.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Pillar 3: Learning */}
                    <div className="space-y-4">
                        <FadeInText delay={0.8}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Learning</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Every prediction compared against outcome. Error measured, model improved.
                            </p>
                        </FadeInText>
                    </div>
                </div>

                {/* Proof of Work - Data Section */}
                <div className="pt-16 border-t border-white/5">
                    <FadeInText delay={0.9}>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-8">
                            Proof of Work
                        </h3>
                    </FadeInText>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* VortexV2 */}
                        <FadeInText delay={1.0}>
                            <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-display text-white uppercase tracking-wider">
                                        VortexV2
                                    </h4>
                                    <span className="text-[10px] font-mono text-accent/70 uppercase">
                                        Marine Weather
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Multi-model ensemble forecasting for offshore conditions.
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-2xl font-light text-white">3.3%</p>
                                        <p className="text-xs text-gray-600">better than ECMWF</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-light text-white">36%</p>
                                        <p className="text-xs text-gray-600">lower forecast bias</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 pt-2">
                                    119 validated observation pairs. Production-ready for 2028 IMOCA 60 campaign.
                                </p>
                            </div>
                        </FadeInText>

                        {/* Alpha Arena */}
                        <FadeInText delay={1.1}>
                            <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-display text-white uppercase tracking-wider">
                                        Alpha Arena
                                    </h4>
                                    <span className="text-[10px] font-mono text-accent/70 uppercase">
                                        Financial Intelligence
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Pattern recognition and multi-model ensemble for trading decisions.
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-2xl font-light text-white">+23.7%</p>
                                        <p className="text-xs text-gray-600">6-month backtest return</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-light text-white">2.05</p>
                                        <p className="text-xs text-gray-600">Sharpe ratio</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 pt-2">
                                    404 trades. 55% win rate. -7.4% max drawdown.
                                </p>
                            </div>
                        </FadeInText>

                    </div>

                    {/* Cortex - Smaller Card */}
                    <FadeInText delay={1.2}>
                        <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-display text-white uppercase tracking-wider">
                                    Cortex
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Development intelligence with 5-layer architecture. Sub-500ms response.
                                </p>
                            </div>
                            <span className="text-[10px] font-mono text-gray-600 uppercase">
                                Internal Tool
                            </span>
                        </div>
                    </FadeInText>
                </div>

            </div>
        </section>
    );
};

