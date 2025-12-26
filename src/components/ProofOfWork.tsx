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

interface Project {
    name: string;
    category: string;
    description: string;
    metrics: Array<{ label: string; value: string; subtext?: string }>;
    details: string;
    highlight?: string;
}

const PROJECTS: Project[] = [
    {
        name: 'VortexV2',
        category: 'Marine Weather Intelligence',
        description: 'Multi-model ensemble forecasting for offshore conditions with explicit uncertainty quantification.',
        metrics: [
            { label: 'MAE', value: '< 8.5kt', subtext: 'Mean Absolute Error' },
            { label: 'vs ECMWF', value: '+3.3%', subtext: 'better accuracy' },
            { label: 'Bias', value: '-36%', subtext: 'lower forecast bias' }
        ],
        details: '119 validated observation pairs. Production-ready for 2028 IMOCA 60 campaign.',
        highlight: 'Production-ready'
    },
    {
        name: 'Cortex / Converx',
        category: 'Strategic Orchestrator',
        description: 'Development intelligence system with 5-layer architecture. Keeps high-level goals active and aligns daily actions.',
        metrics: [
            { label: 'Response Time', value: '< 500ms', subtext: 'sub-second intelligence' },
            { label: 'Strategic ROI', value: '0.73', subtext: 'high-leverage focus' },
            { label: 'Velocity', value: '+15%', subtext: 'tasks completed' }
        ],
        details: 'Strategic sovereignty through context-aware recommendations and automated planning.',
        highlight: 'Internal Tool'
    },
    {
        name: 'Alpha Arena',
        category: 'Financial Intelligence',
        description: 'Pattern recognition and multi-model ensemble for trading decisions with rigorous backtesting.',
        metrics: [
            { label: 'Return', value: '+23.7%', subtext: '6-month backtest' },
            { label: 'Sharpe Ratio', value: '2.05', subtext: 'risk-adjusted' },
            { label: 'Win Rate', value: '55%', subtext: '404 trades' }
        ],
        details: '404 trades executed. 55% win rate. -7.4% max drawdown. Validated against real market conditions.',
        highlight: 'Validated'
    },
    {
        name: 'Personal AI Dataset',
        category: 'Deep Context Engineering',
        description: 'Semantic search and pattern memory system for personal knowledge base with zero-shot context loading.',
        metrics: [
            { label: 'Documents', value: '911', subtext: 'indexed' },
            { label: 'Retrieval', value: '+49%', subtext: 'improvement' },
            { label: 'Context Load', value: 'Zero-shot', subtext: 'instant access' }
        ],
        details: '911 documents indexed. 49% retrieval improvement over baseline. Full codebase and history searchable.',
        highlight: 'Research'
    }
];

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-all space-y-4"
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-display text-white uppercase tracking-wider">
                            {project.name}
                        </h3>
                        {project.highlight && (
                            <>
                                <div className="h-px w-4 bg-accent/30" />
                                <span className="text-[10px] font-mono text-accent/70 uppercase">
                                    {project.highlight}
                                </span>
                            </>
                        )}
                    </div>
                    <p className="text-xs font-mono text-gray-500 uppercase mb-2">
                        {project.category}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed">
                {project.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                {project.metrics.map((metric, idx) => (
                    <div key={idx}>
                        <p className="text-2xl font-light text-white mb-1">
                            {metric.value}
                        </p>
                        <p className="text-xs text-gray-600 mb-0.5">
                            {metric.label}
                        </p>
                        {metric.subtext && (
                            <p className="text-[10px] text-gray-700">
                                {metric.subtext}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Details */}
            <p className="text-xs text-gray-600 pt-2 border-t border-white/5">
                {project.details}
            </p>
        </motion.div>
    );
};

export const ProofOfWork = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10">
            <div className="max-w-5xl w-full space-y-16">
                
                {/* Header */}
                <div className="space-y-6">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">
                            Proof of Work
                        </h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <h2 className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Real Outcomes from Real Projects
                        </h2>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            Every system we build adheres to the Golden Spec: measurable outcomes, verified results, continuous improvement. Here's what we've delivered.
                        </p>
                    </FadeInText>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROJECTS.map((project, index) => (
                        <ProjectCard key={project.name} project={project} index={index} />
                    ))}
                </div>

                {/* Footer Note */}
                <FadeInText delay={0.8}>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-sm text-gray-500 italic text-center">
                            All metrics are validated against real-world outcomes, not simulations.
                        </p>
                    </div>
                </FadeInText>

            </div>
        </section>
    );
};

