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
import AnimationV5_Enhanced from './components/AnimationV5_Enhanced'; // V5: Enhanced with scroll/click/sphere (Current)

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" ref={scrollContainerRef}>

      {/* Background Animation Layer */}
      <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen pointer-events-auto">
        {/* <AnimationV1_Fluid /> */}
        {/* <AnimationV2_Morphing /> */}
        {/* <AnimationV3_SandCube /> */}
        {/* <AnimationV4_Smooth /> */}
        <AnimationV5_Enhanced />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Hero />
          <Philosophy />

          {/* Simple Footer */}
          <footer className="py-12 text-center space-y-4">
            <a
              href="mailto:connect@kempion.com"
              className="text-sm font-mono text-gray-500 hover:text-white transition-colors duration-300 border-b border-transparent hover:border-gray-500 pb-0.5"
            >
              connect@kempion.com
            </a>
            <p className="text-[10px] text-gray-800 font-mono tracking-widest uppercase">
              &copy; {new Date().getFullYear()} Kempion Research
            </p>
          </footer>
        </div>
      </div>

    </div>
  );
}

export default App;
