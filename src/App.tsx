import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';

function App() {
  return (
    <main className="bg-background text-white min-h-screen selection:bg-accent/30 selection:text-white">
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
    </main>
  );
}

export default App;
