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

interface Milestone {
    phase: string;
    year: string;
    title: string;
    description: string;
    keyOutcomes: string[];
    status: 'current' | 'future';
}

const MILESTONES: Milestone[] = [
    {
        phase: 'Phase 0',
        year: '2025',
        title: 'Foundation',
        description: 'MVP deployment with core 5-layer intelligence stack. Strategic orchestrator operational.',
        keyOutcomes: [
            '5-layer architecture fully implemented',
            'Strategic sovereignty achieved',
            'Calibration error < 5% validated'
        ],
        status: 'current'
    },
    {
        phase: 'Year 3',
        year: '2028',
        title: 'Marine Intelligence',
        description: 'VortexV2 production deployment for IMOCA 60 campaign. Real-time decision support at sea.',
        keyOutcomes: [
            'Weather forecasting MAE < 8.5kt',
            'Multi-model ensemble operational',
            'Scenario bands validated in production'
        ],
        status: 'future'
    },
    {
        phase: 'Year 5',
        year: '2030',
        title: 'Personal Cognitive OS',
        description: 'Converx evolves into a complete personal intelligence operating system. Full context awareness across all digital life.',
        keyOutcomes: [
            'Zero-shot context loading universal',
            'Strategic ROI > 0.8 consistently',
            'Compound effect: 100 → 300 units output'
        ],
        status: 'future'
    },
    {
        phase: 'Year 10',
        year: '2035',
        title: 'Maximum Collaboration',
        description: 'Human-AI collaboration reaches optimal balance. Humans provide intuition and values; AI provides precision and scale.',
        keyOutcomes: [
            'Compound effect: 100 → 500 units output',
            'Calibration error < 2%',
            'Strategic sovereignty universal'
        ],
        status: 'future'
    }
];

const TimelineItem = ({ milestone, index }: { milestone: Milestone, index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pl-12 pb-12 last:pb-0"
        >
            {/* Timeline Line */}
            {index < MILESTONES.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />
            )}

            {/* Timeline Dot */}
            <div className={`absolute left-0 top-2 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                milestone.status === 'current'
                    ? 'bg-accent/20 border-accent/60'
                    : 'bg-white/5 border-white/20'
            }`}>
                <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'current' ? 'bg-accent' : 'bg-gray-600'
                }`} />
            </div>

            {/* Content Card */}
            <div className={`p-6 rounded-xl border transition-all ${
                milestone.status === 'current'
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-white/5 bg-white/[0.02]'
            }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-accent/70 uppercase">
                                {milestone.phase}
                            </span>
                            <div className="h-px w-4 bg-accent/30" />
                            <span className="text-xs font-mono text-gray-500">
                                {milestone.year}
                            </span>
                        </div>
                        <h3 className="text-xl font-display text-white uppercase tracking-wider mb-2">
                            {milestone.title}
                        </h3>
                    </div>
                    {milestone.status === 'current' && (
                        <span className="text-[10px] font-mono text-accent/70 uppercase px-2 py-1 border border-accent/30 rounded">
                            Current
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {milestone.description}
                </p>

                {/* Key Outcomes */}
                <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-mono text-gray-500 uppercase mb-3">
                        Key Outcomes
                    </p>
                    <ul className="space-y-2">
                        {milestone.keyOutcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-accent/60 mt-1">→</span>
                                <span className="text-xs text-gray-400 leading-relaxed">
                                    {outcome}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export const VisionTimeline = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10">
            <div className="max-w-5xl w-full space-y-16">
                
                {/* Header */}
                <div className="space-y-6">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">
                            The Vision
                        </h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <h2 className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            The Path to 2035
                        </h2>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            From foundation to maximum human-AI collaboration. The compound effect of strategic intelligence: 100 units of input becomes 500 units of strategic output.
                        </p>
                    </FadeInText>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {MILESTONES.map((milestone, index) => (
                        <TimelineItem key={milestone.phase} milestone={milestone} index={index} />
                    ))}
                </div>

                {/* Footer Note */}
                <FadeInText delay={0.8}>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-sm text-gray-500 italic text-center">
                            Each milestone builds on the previous, creating compound strategic advantage.
                        </p>
                    </div>
                </FadeInText>

            </div>
        </section>
    );
};

