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

type Tab = 'briefing' | 'analysis' | 'metrics';

interface TabContent {
    title: string;
    content: string[];
}

const TAB_CONTENT: Record<Tab, TabContent> = {
    briefing: {
        title: 'Daily Briefing',
        content: [
            '$ cortex briefing',
            '',
            '📊 Strategic Overview',
            '─────────────────────────────────────────',
            '',
            '🎯 Active Goals (3)',
            '  • Complete Phase 1 implementation (85% → 100%)',
            '  • Deploy Kempion Research site v2.0',
            '  • Optimize VortexV2 ensemble weights',
            '',
            '⚠️  Warnings (2)',
            '  • Strategic drift detected: 4h on low-leverage tasks',
            '  • Context drift: 3 docs outdated vs codebase',
            '',
            '📈 Velocity Metrics',
            '  • This week: 12 tasks completed (↑ 15%)',
            '  • Strategic ROI: 0.73 (target: >0.7)',
            '',
            '💡 Next Best Action',
            '  → Complete IntelligenceStack component integration',
            '    Estimated impact: High | Time: 2h',
            '',
            '$'
        ]
    },
    analysis: {
        title: 'Pattern Analysis',
        content: [
            '$ cortex analyze --pattern "authentication"',
            '',
            '🔍 Pattern Search: authentication',
            '─────────────────────────────────────────',
            '',
            'Found 12 similar implementations across codebase:',
            '',
            '1. VortexV2/auth/jwt.py (3 months ago)',
            '   → JWT token validation with refresh',
            '   → Pattern match: 87%',
            '',
            '2. Cortex/auth/middleware.ts (2 weeks ago)',
            '   → Session-based auth with Redis',
            '   → Pattern match: 72%',
            '',
            '3. AlphaArena/api/auth.py (1 month ago)',
            '   → API key authentication',
            '   → Pattern match: 65%',
            '',
            '📊 Context Memory',
            '  • Last used: 2 weeks ago',
            '  • Success rate: 94%',
            '  • Recommended approach: JWT (matches current stack)',
            '',
            '$'
        ]
    },
    metrics: {
        title: 'Metrics Dashboard',
        content: [
            '$ cortex metrics --period 30d',
            '',
            '📊 Development Intelligence (Last 30 Days)',
            '─────────────────────────────────────────',
            '',
            'Velocity',
            '  Tasks completed:     142 (↑ 12%)',
            '  Avg cycle time:       2.3 days (↓ 8%)',
            '  Strategic alignment:  0.73 (↑ 5%)',
            '',
            'Quality',
            '  Test coverage:        78% (↑ 3%)',
            '  Bug rate:            2.1% (↓ 15%)',
            '  Code review time:    4.2h avg',
            '',
            'Strategic ROI',
            '  High-leverage tasks: 68% (target: >70%)',
            '  Low-leverage tasks:  32% (target: <30%)',
            '  Strategic drift:     -2.3% (improving)',
            '',
            '⚠️  Alert: Low-leverage tasks above threshold',
            '💡 Recommendation: Focus on high-impact work',
            '',
            '$'
        ]
    }
};

const TerminalWindow = () => {
    const [activeTab, setActiveTab] = useState<Tab>('briefing');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const tabs: { id: Tab; label: string }[] = [
        { id: 'briefing', label: 'Briefing' },
        { id: 'analysis', label: 'Analysis' },
        { id: 'metrics', label: 'Metrics' }
    ];

    const currentContent = TAB_CONTENT[activeTab];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="rounded-lg overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm"
        >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 flex items-center gap-2 ml-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                                activeTab === tab.id
                                    ? 'bg-accent/20 text-accent border border-accent/30'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed overflow-x-auto">
                <div className="space-y-1">
                    {currentContent.content.map((line, index) => {
                        if (line.startsWith('$')) {
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-green-400">$</span>
                                    <span className="text-white">{line.slice(1).trim() || ' '}</span>
                                </div>
                            );
                        }
                        if (line.startsWith('📊') || line.startsWith('🎯') || line.startsWith('⚠️') || line.startsWith('💡') || line.startsWith('🔍') || line.startsWith('📈')) {
                            return (
                                <div key={index} className="text-accent/80 font-semibold mt-2">
                                    {line}
                                </div>
                            );
                        }
                        if (line.startsWith('  •') || line.startsWith('  →')) {
                            return (
                                <div key={index} className="text-gray-400 ml-4">
                                    {line}
                                </div>
                            );
                        }
                        if (line.includes('─')) {
                            return (
                                <div key={index} className="text-gray-600">
                                    {line}
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={line.trim() ? 'text-gray-300' : 'text-transparent'}>
                                {line || '.'}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export const CodeShowcase = () => {
    return (
        <section className="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col items-center justify-center bg-transparent relative z-10">
            <div className="max-w-5xl w-full space-y-16">
                
                {/* Header */}
                <div className="space-y-6">
                    <FadeInText>
                        <h3 className="text-xs font-mono text-accent/80 tracking-widest uppercase mb-4">
                            Built for Builders
                        </h3>
                    </FadeInText>
                    <FadeInText delay={0.2}>
                        <h2 className="text-2xl md:text-4xl font-light leading-snug text-gray-200">
                            Real Code, Real Outputs
                        </h2>
                    </FadeInText>
                    <FadeInText delay={0.4}>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                            This isn't theory. It's working software. Explore the actual CLI outputs from Cortex, our strategic intelligence system.
                        </p>
                    </FadeInText>
                </div>

                {/* Terminal Window */}
                <FadeInText delay={0.6}>
                    <TerminalWindow />
                </FadeInText>

                {/* Footer Note */}
                <FadeInText delay={0.8}>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-sm text-gray-500 italic text-center">
                            Switch between tabs to see different capabilities.
                        </p>
                    </div>
                </FadeInText>

            </div>
        </section>
    );
};

