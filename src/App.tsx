import { useRef } from 'react';
import { Hero } from './components/Hero';

// PHILOSOPHY VERSIONS - Uncomment to switch
// import { Philosophy } from './components/Philosophy'; // V1: Original "collaboration surface"
import { PhilosophyV2 as Philosophy } from './components/PhilosophyV2'; // V2: Manifesto-aligned "complexity is failure"

// ANIMATION VERSIONS - Uncomment to switch
// import AnimationV1_Fluid from './components/AnimationV1_Fluid'; // V1: Original Fluid Waves
// import AnimationV2_Morphing from './components/AnimationV2_Morphing'; // V2: Cloud/Sphere/Cube Morph
// import AnimationV3_SandCube from './components/AnimationV3_SandCube'; // V3: Interactive Sand Cube
// import AnimationV4_Smooth from './components/AnimationV4_Smooth'; // V4: Optimized Spring Physics
import AnimationV5_Enhanced from './components/AnimationV5_Enhanced'; // V5: Enhanced with scroll/click/sphere (Previous)
// import AnimationV6_EventHorizon from './components/AnimationV6_EventHorizon'; // V6: 20k Particles, Scroll Interaction, Flow (Restored)
// import AnimationV7_Convergence from './components/AnimationV7_Convergence'; // V7: 5 Clusters Converging (Archived)
// import AnimationV8_NaturalGenius from './components/AnimationV8_NaturalGenius'; // V8: Cloud -> Sphere -> Cube Loop (Archived)





function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" ref={scrollContainerRef}>

      {/* Background Animation Layer */}
      <div className="fixed inset-0 z-0 opacity-35 mix-blend-lighten pointer-events-auto">
        {/* <AnimationV1_Fluid /> */}
        {/* <AnimationV2_Morphing /> */}
        {/* <AnimationV3_SandCube /> */}
        {/* <AnimationV4_Smooth /> */}
        <AnimationV5_Enhanced />
        {/* <AnimationV6_EventHorizon /> */}
        {/* <AnimationV7_Convergence /> */}
        {/* <AnimationV8_NaturalGenius /> */}




      </div>

      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Hero />
          <Philosophy />

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
