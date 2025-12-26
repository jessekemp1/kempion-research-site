import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

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

interface Pillar {
    id: string;
    title: string;
    problem: string;
    goal: string;
    proofOfWork?: string;
    layers: {
        layer1: string;
        layer2: string;
        layer3: string;
        layer4: string;
        layer5: string;
    };
}

const PILLARS: Pillar[] = [
    {
        id: 'calibration',
        title: 'Calibration & Reliability',
        problem: 'AI systems are confident but often wrong ("hallucination"). They lack self-awareness of their own error margins.',
        goal: 'A system that knows when it doesn\'t know. Target: Calibration Error < 5%.',
        layers: {
            layer1: 'Grounding every claim in verified data (e.g., source code, file stats).',
            layer2: 'Comparing current confidence against historical accuracy of similar predictions.',
            layer3: 'Triggering "Low Confidence" alerts when data is sparse.',
            layer4: 'Recommending research actions when uncertainty is high, rather than execution.',
            layer5: 'Including verification steps in every generated plan.'
        }
    },
    {
        id: 'forecasting',
        title: 'Probabilistic Forecasting',
        problem: 'Single-point forecasts ("It will be sunny") are lies. Reality is a probability distribution.',
        goal: 'Explicit representation of uncertainty. "Scenario Bands" (Optimistic, Likely, Conservative) with specific conditions for each.',
        proofOfWork: 'VortexV2 (Marine Weather Intelligence)',
        layers: {
            layer1: 'Ingesting raw ensemble data (e.g., GFS, ECMWF models).',
            layer2: 'Historical performance of each model in similar conditions.',
            layer3: 'Divergence alerts when models disagree (high uncertainty).',
            layer4: 'Suggesting routing based on risk tolerance (e.g., "Take the northern route if risk tolerance > 0.7").',
            layer5: 'Contingency waypoints defined for each scenario band.'
        }
    },
    {
        id: 'strategy',
        title: 'Strategic Intelligence',
        problem: 'Humans drown in tactics ("check email") and lose strategy ("win the market"). We react instead of direct.',
        goal: 'Strategic Sovereignty. A system that keeps high-level goals active and aligns daily actions to them.',
        proofOfWork: 'Cortex / Converx (Strategic Orchestrator)',
        layers: {
            layer1: 'Scanning the "Life Weather" (Health, Finance, Work Project status).',
            layer2: 'Retrieving long-term goals and past strategic decisions.',
            layer3: 'Alerting on "Strategic Drift" (time spent on low-leverage tasks).',
            layer4: '"Next Best Action" optimized for strategic ROI, not just urgency.',
            layer5: 'Auto-generating week plans that respect energy and time constraints.'
        }
    },
    {
        id: 'context',
        title: 'Deep Context Engineering',
        problem: 'Generic intelligence is useless for specific problems. AI needs your context (codebase, history, values) to be useful.',
        goal: 'Zero-Shot Context Loading. The system knows the full context before you ask.',
        proofOfWork: 'Personal AI Dataset (911 indexed documents, 49% retrieval improvement)',
        layers: {
            layer1: 'Real-time indexing of the entire digital footprint (files, git history).',
            layer2: 'Semantic search and "Pattern Memory" (what worked before).',
            layer3: 'Detecting "Context Drift" (when documentation lags behind code).',
            layer4: 'Context-aware code generation (using local patterns).',
            layer5: 'Updating documentation and knowledge bases as part of the workflow.'
        }
    }
];

const PillarCard = ({ pillar, index }: { pillar: Pillar, index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-all cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-accent/70 uppercase">Pillar {index + 1}</span>
                        <div className="h-px w-8 bg-accent/30" />
                    </div>
                    <h3 className="text-lg font-display text-white uppercase tracking-wider mb-2">
                        {pillar.title}
                    </h3>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 text-xl"
                >
                    ↓
                </motion.div>
            </div>

            {/* Problem & Goal */}
            <div className="space-y-3 mb-4">
                <div>
                    <p className="text-xs font-mono text-gray-500 uppercase mb-1">The Problem</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{pillar.problem}</p>
                </div>
                <div>
                    <p className="text-xs font-mono text-gray-500 uppercase mb-1">The Goal</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{pillar.goal}</p>
                </div>
                {pillar.proofOfWork && (
                    <div>
                        <p className="text-xs font-mono text-accent/70 uppercase mb-1">Proof of Work</p>
                        <p className="text-sm text-accent/80">{pillar.proofOfWork}</p>
                    </div>
                )}
            </div>

            {/* Expanded 5-Layer Implementation */}
            <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="pt-4 border-t border-white/5 space-y-3">
                    <p className="text-xs font-mono text-gray-500 uppercase mb-3">5-Layer Implementation</p>
                    {Object.entries(pillar.layers).map(([layerKey, description], idx) => (
                        <div key={layerKey} className="pl-4 border-l-2 border-accent/20">
                            <p className="text-xs font-mono text-accent/60 mb-1">
                                Layer {idx + 1}: {layerKey.replace('layer', '').toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const ResearchPillars = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10">
            <div className="max-w-5xl w-full space-y-16">
                
                {/* Header */}
                <div className="space-y-6">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">
                            The Research
                        </h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <h2 className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Four Pillars of Decision Intelligence
                        </h2>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            We apply the Golden Spec protocol and 5-Layer Stack to four critical areas. Each pillar demonstrates how engineering rigor transforms abstract goals into measurable outcomes.
                        </p>
                    </FadeInText>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PILLARS.map((pillar, index) => (
                        <PillarCard key={pillar.id} pillar={pillar} index={index} />
                    ))}
                </div>

                {/* Footer Note */}
                <FadeInText delay={0.8}>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-sm text-gray-500 italic text-center">
                            Click on any pillar to explore its 5-layer implementation.
                        </p>
                    </div>
                </FadeInText>

            </div>
        </section>
    );
};

