import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { Hero } from './components/Hero';

// PHILOSOPHY VERSIONS - Uncomment to switch
// import { Philosophy } from './components/Philosophy'; // V1: Original "collaboration surface"
import { PhilosophyV2 as Philosophy } from './components/PhilosophyV2'; // V2: Manifesto-aligned "complexity is failure"

// PHASE 1 COMPONENTS - New content sections
import { IntelligenceStack } from './components/IntelligenceStack';
import { ResearchPillars } from './components/ResearchPillars';
import { CodeShowcase } from './components/CodeShowcase';
import { ProofOfWork } from './components/ProofOfWork';
import { VisionTimeline } from './components/VisionTimeline';

// ANIMATION - Lazy loaded for performance (~600KB Three.js deferred)
const AnimationV5_Enhanced = lazy(() => import('./components/animations/v1/AnimationV5_Enhanced'));

// ANIMATION VERSIONS (archived) - Uncomment and update lazy import to switch
// AnimationV1_Fluid - Original Fluid Waves
// AnimationV2_Morphing - Cloud/Sphere/Cube Morph
// AnimationV3_SandCube - Interactive Sand Cube
// AnimationV4_Smooth - Optimized Spring Physics
// AnimationV5_Enhanced - Enhanced with scroll/click/sphere (Current)
// AnimationV6_EventHorizon - 20k Particles, Scroll Interaction, Flow
// AnimationV7_Convergence - 5 Clusters Converging
// AnimationV8_NaturalGenius - Cloud -> Sphere -> Cube Loop





function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [animationOpacity, setAnimationOpacity] = useState(0.5);

  // Fade animation opacity from 50% to 35% as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 800; // Fade complete by 800px scroll
      const minOpacity = 0.35;
      const maxOpacity = 0.5;

      const progress = Math.min(scrollY / maxScroll, 1);
      const newOpacity = maxOpacity - (progress * (maxOpacity - minOpacity));
      setAnimationOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" ref={scrollContainerRef}>

      {/* Background Animation Layer - Lazy loaded, scroll-fading opacity */}
      <div
        className="fixed inset-0 z-0 mix-blend-lighten pointer-events-auto"
        style={{ opacity: animationOpacity }}
      >
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <AnimationV5_Enhanced />
        </Suspense>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Hero />
          <Philosophy />
          <IntelligenceStack />
          <ResearchPillars />
          <CodeShowcase />
          <ProofOfWork />
          <VisionTimeline />

          {/* Enhanced Footer */}
          <footer className="py-16 px-6 md:px-24">
            <div className="max-w-5xl mx-auto">

              {/* CTA Section */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Building decision intelligence systems?
                  </p>
                  <p className="text-xs text-gray-600">
                    We work with select partners on applied research.
                  </p>
                </div>
                <a
                  href="mailto:connect@kempion.com?subject=Kempion%20Research%20Inquiry"
                  className="px-6 py-3 text-sm font-mono text-white border border-white/20 rounded-full hover:bg-white/5 hover:border-white/40 transition-all"
                >
                  Start a conversation
                </a>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">
                  &copy; {new Date().getFullYear()} Kempion Research
                </p>
                <p className="text-xs text-gray-600 italic">
                  From hoping to knowing.
                </p>
              </div>

            </div>
          </footer>
        </div>
      </div>

    </div>
  );
}

export default App;
