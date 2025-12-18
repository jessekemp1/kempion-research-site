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
import { useId, useRef, useState } from 'react';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const detailsId = useId();

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

                {/* The Thesis (Public) */}
                <div className="space-y-8">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">Decision Intelligence Research</h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <p className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Advancing Decision Intelligence.
                        </p>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            Calibrated decision intelligence with <span className="text-white font-medium">memory</span>, <span className="text-white font-medium">scenario bands</span>, and <span className="text-white font-medium">learning</span>.
                        </p>
                    </FadeInText>

                    {/* What we build (Public) */}
                    <FadeInText delay={0.55}>
                        <div className="max-w-3xl space-y-5">
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                Kempion Research builds decision intelligence systems. These tools help individuals and organizations make better choices when the situation is complex, the information is incomplete, and the costs of being wrong are real.{' '}
                                <button
                                    type="button"
                                    aria-expanded={isExpanded}
                                    aria-controls={detailsId}
                                    onClick={() => setIsExpanded((v) => !v)}
                                    className="text-white/80 underline underline-offset-4 decoration-white/15 hover:decoration-white/50 hover:text-white/90 transition-colors"
                                >
                                    (see model)
                                </button>
                            </p>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                Many AI systems can be fluent without being reliable. Our approach is different: we optimize for <span className="text-white/90">calibration</span> and <span className="text-white/90">outcomes</span>, not eloquence.
                            </p>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                We combine three capabilities that turn "answers" into usable judgment:
                            </p>
                            <ul className="text-sm md:text-base text-gray-500 leading-relaxed space-y-2 pl-5 list-disc marker:text-gray-700">
                                <li>
                                    <span className="text-white/90">Memory</span>: persistent context (goals, constraints, history, domain knowledge)
                                </li>
                                <li>
                                    <span className="text-white/90">Scenario Bands</span>: explicit uncertainty (optimistic / likely / conservative) with the conditions that would move the forecast
                                </li>
                                <li>
                                    <span className="text-white/90">Learning</span>: feedback loops that measure prediction vs. outcome and improve over time
                                </li>
                            </ul>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                Together, these move people from hoping to knowing - not by removing uncertainty, but by making it visible, actionable, and measurable.
                            </p>

                            {isExpanded ? (
                                <div
                                    id={detailsId}
                                    className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5 md:px-6 md:py-6 text-left space-y-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">
                                                Deeper Dive
                                            </p>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                A practical model for reliable decisions: memory, uncertainty, learning, and bounded agency.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsExpanded(false)}
                                            className="shrink-0 text-xs font-mono text-gray-500 hover:text-white transition-colors border border-white/10 hover:border-white/30 rounded-full px-3 py-1"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-display text-white uppercase tracking-wider">1. The Problem</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Most decisions break down in the same few places:
                                        </p>
                                        <ul className="text-sm text-gray-500 leading-relaxed space-y-1 pl-5 list-disc marker:text-gray-700">
                                            <li><span className="text-white/90">Missing context</span>: history and constraints are not carried forward</li>
                                            <li><span className="text-white/90">False certainty</span>: single-point answers hide risk and conditions</li>
                                            <li><span className="text-white/90">No learning loop</span>: outcomes are not compared against predictions</li>
                                            <li><span className="text-white/90">Misaligned automation</span>: either risky autonomy or constant supervision</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-display text-white uppercase tracking-wider">2. Our Thesis (Operational)</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Intelligence is measured by <span className="text-white/90">calibration</span> and <span className="text-white/90">outcomes</span>, not confidence.
                                        </p>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            A decision intelligence system should:
                                        </p>
                                        <ul className="text-sm text-gray-500 leading-relaxed space-y-1 pl-5 list-disc marker:text-gray-700">
                                            <li>recalls the right context at the right time</li>
                                            <li>represents uncertainty explicitly</li>
                                            <li>recommends actions with clear conditions and tradeoffs</li>
                                            <li>learns from outcomes to improve future decisions</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-display text-white uppercase tracking-wider">3. The Kempion Model</h4>

                                        <div className="space-y-2">
                                            <h5 className="text-xs font-mono text-gray-500 tracking-widest uppercase">3.1 Memory (Deep Context)</h5>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                We treat context as infrastructure. Not a prompt. Not a chat log.
                                            </p>
                                            <p className="text-sm text-gray-500 leading-relaxed">Memory includes:</p>
                                            <ul className="text-sm text-gray-500 leading-relaxed space-y-1 pl-5 list-disc marker:text-gray-700">
                                                <li>goals and priorities</li>
                                                <li>constraints (time, energy, capital, risk)</li>
                                                <li>decision history (what you tried, what happened)</li>
                                                <li>domain knowledge (codebases, markets, operations, health signals)</li>
                                            </ul>
                                        </div>

                                        <div className="space-y-2">
                                            <h5 className="text-xs font-mono text-gray-500 tracking-widest uppercase">3.2 Scenario Bands (Uncertainty Made Usable)</h5>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                We do not ship single-point answers as "truth."
                                            </p>
                                            <p className="text-sm text-gray-500 leading-relaxed">We produce scenario bands:</p>
                                            <ul className="text-sm text-gray-500 leading-relaxed space-y-1 pl-5 list-disc marker:text-gray-700">
                                                <li><span className="text-white/90">Optimistic</span>: best reasonable case under stated conditions</li>
                                                <li><span className="text-white/90">Likely</span>: central trajectory under normal variance</li>
                                                <li><span className="text-white/90">Conservative</span>: downside-aware path when blockers occur</li>
                                            </ul>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                Each scenario includes: conditions, risks, and what evidence would update the forecast.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h5 className="text-xs font-mono text-gray-500 tracking-widest uppercase">3.3 Learning (Calibration Loops)</h5>
                                            <p className="text-sm text-gray-500 leading-relaxed">Our systems log:</p>
                                            <ul className="text-sm text-gray-500 leading-relaxed space-y-1 pl-5 list-disc marker:text-gray-700">
                                                <li>the prediction (and its uncertainty)</li>
                                                <li>the recommended action</li>
                                                <li>what was chosen</li>
                                                <li>the observed outcome</li>
                                            </ul>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                Then we measure error and improve: predict - act - observe - compare - adjust.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h5 className="text-xs font-mono text-gray-500 tracking-widest uppercase">3.4 Agency With Boundaries</h5>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                Automation without policy is unsafe. Policy without automation is useless.
                                            </p>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                We focus on the architecture between:
                                            </p>
                                            <ul className="text-sm text-gray-500 leading-relaxed space-y-1 pl-5 list-disc marker:text-gray-700">
                                                <li>advisor-only systems (safe, low leverage)</li>
                                                <li>fully autonomous systems (high leverage, high risk)</li>
                                            </ul>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                We design autonomy ladders: what can be done automatically, what needs approval, and what is off-limits.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
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
                                Persist the context that matters: goals, constraints, history, and domain knowledge.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Pillar 2: Scenario Bands */}
                    <div className="space-y-4">
                        <FadeInText delay={0.7}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Scenario Bands</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Replace false certainty with ranges and conditions: optimistic, likely, conservative.
                            </p>
                        </FadeInText>
                    </div>

                    {/* Pillar 3: Learning */}
                    <div className="space-y-4">
                        <FadeInText delay={0.8}>
                            <div className="h-0.5 w-12 bg-accent/50 mb-6" />
                            <h4 className="text-lg font-display text-white uppercase tracking-wider">Learning</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Measure prediction vs. outcome, then improve through feedback loops.
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

