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

interface Layer {
    number: number;
    name: string;
    subtitle: string;
    description: string;
    color: string;
    technicalDetails: string;
}

const LAYERS: Layer[] = [
    {
        number: 1,
        name: 'Analysis',
        subtitle: 'The Senses',
        description: 'Deep profiling of reality.',
        color: 'blue',
        technicalDetails: 'Ingesting raw data, performing deep analysis, and extracting meaningful patterns from the environment.'
    },
    {
        number: 2,
        name: 'Memory',
        subtitle: 'The Experience',
        description: 'Pattern matching against history.',
        color: 'purple',
        technicalDetails: 'Persistent context storage, semantic search, and pattern recognition against historical data.'
    },
    {
        number: 3,
        name: 'Warning System',
        subtitle: 'The Nerves',
        description: 'Real-time health and risk monitoring.',
        color: 'orange',
        technicalDetails: 'Continuous monitoring, anomaly detection, and alerting when thresholds are breached or patterns deviate.'
    },
    {
        number: 4,
        name: 'Recommendation',
        subtitle: 'The Brain',
        description: 'Context-aware strategic advice.',
        color: 'green',
        technicalDetails: 'Strategic analysis, context-aware suggestions, and optimized decision recommendations based on all layers.'
    },
    {
        number: 5,
        name: 'Planning',
        subtitle: 'The Hands',
        description: 'Execution and tracking.',
        color: 'cyan',
        technicalDetails: 'Action plan generation, task breakdown, progress tracking, and adaptive execution management.'
    }
];

const LayerCard = ({ layer, index }: { layer: Layer, index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const colorClasses = {
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        green: 'bg-green-500/10 border-green-500/30 text-green-400',
        cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative p-6 rounded-xl border transition-all duration-300 ${colorClasses[layer.color as keyof typeof colorClasses]} ${isHovered ? 'border-opacity-60 bg-opacity-20' : 'border-opacity-20 bg-opacity-10'}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-gray-500">Layer {layer.number}</span>
                        <div className="h-px w-8 bg-current opacity-30" />
                    </div>
                    <h3 className="text-xl font-display text-white uppercase tracking-wider mb-1">
                        {layer.name}
                    </h3>
                    <p className="text-sm text-gray-400 italic">{layer.subtitle}</p>
                </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                {layer.description}
            </p>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={isHovered ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="pt-3 border-t border-current/20">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {layer.technicalDetails}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const IntelligenceStack = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10">
            <div className="max-w-5xl w-full space-y-16">
                
                {/* Header */}
                <div className="space-y-6">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">
                            The Architecture
                        </h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <h2 className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            A Complete 5-Layer Intelligence Stack
                        </h2>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            True intelligence requires a complete architecture, not just a model. Each layer builds on the previous, creating a system that understands context, monitors itself, and adapts.
                        </p>
                    </FadeInText>
                </div>

                {/* Stack Visualization */}
                <div className="space-y-4">
                    {LAYERS.map((layer, index) => (
                        <LayerCard key={layer.number} layer={layer} index={index} />
                    ))}
                </div>

                {/* Footer Note */}
                <FadeInText delay={0.8}>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-sm text-gray-500 italic text-center">
                            Hover over each layer to reveal technical implementation details.
                        </p>
                    </div>
                </FadeInText>

            </div>
        </section>
    );
};

