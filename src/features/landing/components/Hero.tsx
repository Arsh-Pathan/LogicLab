import { ChevronRight } from 'lucide-react';
import HomeInteractiveDemo from './HomeInteractiveDemo';

interface HeroProps {
  onEnter: () => void;
}

export default function Hero({ onEnter }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center pt-48 pb-32 px-6 lg:px-12">
      <div className="hero-meta mb-12 flex items-center gap-6 opacity-30">
        <span className="text-[9px] font-black uppercase tracking-[0.6em]">System Protocol 4.0</span>
        <div className="w-12 h-px bg-white/20" />
        <span className="text-[9px] font-black uppercase tracking-[0.6em]">Real-time Synthesis</span>
      </div>

      <h1 className="text-[13vw] lg:text-[10vw] font-black font-premium leading-[0.7] uppercase tracking-[-0.06em] text-center mb-20 pointer-events-none">
        <div className="overflow-hidden h-[1.1em] hero-line text-reveal-mask">
          <span className="char-reveal block">Architecting</span>
        </div>
        <div className="overflow-hidden h-[1.1em] hero-line text-reveal-mask">
          <span className="premium-solid-text char-reveal block">Logic</span>
        </div>
      </h1>

      {/* The Live Interactive Core */}
      <div className="demo-container w-full max-w-6xl aspect-[16/9] lg:aspect-[21/9] relative z-20 group">
        {/* Removed glow backdrop */}
        <div className="w-full h-full transform transition-transform duration-1000 group-hover:scale-[1.02] group-hover:rotate-x-2">
          <HomeInteractiveDemo />
        </div>
      </div>

      <div className="hero-meta mt-20 max-w-xl text-center">
        <p className="text-sm lg:text-base font-medium opacity-30 leading-relaxed uppercase tracking-wider">
          The professional environment for digital systems engineering. <br /> Atomic gate precision. Sub-nanosecond latency. Fully modular.
        </p>
        <button 
          onClick={onEnter}
          className="btn-primary mt-12 mx-auto"
        >
          Enter Laboratory <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
