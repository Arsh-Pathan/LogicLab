import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  AlertTriangle, 
  RefreshCcw, 
  Home, 
  Activity, 
  Binary,
  ShieldOff,
  Terminal,
  Unplug,
  ZapOff
} from 'lucide-react';
import CircuitBackground from '../components/visuals/CircuitBackground';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance "Glitch"
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
      
      tl.from('.glitch-title', { 
        y: 100, 
        opacity: 0, 
        scale: 1.2,
        skewX: 10,
        filter: 'blur(30px)'
      });

      tl.from('.reveal-item', { 
        y: 20, 
        opacity: 0, 
        stagger: 0.1 
      }, "-=1");

      // Continuous Glitch Effect
      gsap.to('.glitch-layer', {
        x: () => Math.random() * 10 - 5,
        y: () => Math.random() * 6 - 3,
        opacity: () => Math.random() * 0.5 + 0.2,
        duration: 0.05,
        repeat: -1,
        repeatRefresh: true,
        ease: 'none'
      });

      // Floating Icons
      gsap.to('.floating-icon', {
        y: -15,
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.5
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-app flex items-center justify-center p-8 relative overflow-hidden selection:bg-red-500 selection:text-white">
      
      {/* Background Layer: Malfunctioning Wires */}
      <div className="absolute inset-0 opacity-[0.04] grayscale invert">
         <CircuitBackground />
      </div>

      {/* Atmospheric Scanning Overlay (CRT Feel) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-0" style={{ backgroundSize: '100% 3px, 3px 100%' }} />

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center gap-16">
         
         {/* Status Header */}
         <div className="reveal-item space-y-4">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-red-500/20 bg-red-500/5 backdrop-blur-md">
               <ShieldOff size={14} className="text-red-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-red-500 italic">Core Topology: COMPROMISED</span>
            </div>
         </div>

         {/* Hero Error Section */}
         <div className="relative">
            <h1 className="glitch-title text-[20vw] font-black leading-none tracking-tightest select-none relative italic">
               404
               <span className="glitch-layer absolute inset-0 text-red-500/30 font-black pointer-events-none" style={{ left: '2px', top: '-1px' }}>404</span>
               <span className="glitch-layer absolute inset-0 text-cyan-500/30 font-black pointer-events-none" style={{ left: '-2px', top: '1px' }}>404</span>
            </h1>
            <div className="absolute -top-12 -right-12 floating-icon">
               <ZapOff size={48} className="text-dim opacity-20" />
            </div>
            <div className="absolute -bottom-12 -left-12 floating-icon">
               <Unplug size={48} className="text-dim opacity-20" />
            </div>
         </div>

         {/* Error Narrative */}
         <div className="space-y-8 reveal-item">
            <div className="flex flex-col gap-4">
               <h2 className="text-4xl md:text-6xl font-black italic text-main uppercase tracking-tighter">LATTICE_TRACE_FAILURE</h2>
               <div className="h-[1px] w-32 bg-main mx-auto opacity-10" />
            </div>
            <p className="text-xl md:text-2xl text-dim font-medium max-w-2xl mx-auto opacity-70 leading-relaxed uppercase tracking-widest italic">
               The architectural address you are attempting to synthesize does not exist 
               in our persistent registry. Propagation lattice collapsed at point_0x0404.
            </p>
         </div>

         {/* Institutional Recovery Buttons */}
         <div className="flex flex-wrap justify-center gap-10 reveal-item pt-10">
            <button 
               onClick={() => navigate('/home')}
               className="px-20 py-8 bg-main text-app text-[11px] font-black uppercase tracking-[0.5em] rounded-sm hover:invert transition-all shadow-float flex items-center gap-8 group"
            >
               <Home size={20} className="group-hover:-translate-y-2 transition-transform" />
               Return to Base
            </button>
            <button 
               onClick={() => window.location.reload()}
               className="px-20 py-8 border border-border-strong text-main text-[11px] font-black uppercase tracking-[0.5em] rounded-sm hover:bg-main hover:text-app transition-all flex items-center gap-8 group"
            >
               <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
               Re-Sync Node
            </button>
         </div>

         {/* Technical Metadata Footer */}
         <div className="pt-32 flex flex-col items-center gap-8 reveal-item">
            <div className="flex items-center gap-12 opacity-20">
               <div className="flex flex-col items-center gap-2">
                  <Terminal size={24} />
                  <span className="text-[8px] font-black uppercase tracking-widest">TRACE_LOG</span>
               </div>
               <div className="w-24 h-[1px] bg-main" />
               <div className="flex flex-col items-center gap-2">
                  <Binary size={24} />
                  <span className="text-[8px] font-black uppercase tracking-widest">BIT_DUMP</span>
               </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[1em] text-red-500/50 animate-pulse italic">Critical Node Absence // Node_0424</span>
         </div>
      </div>

      {/* Extreme Atmospheric Decor */}
      <div className="absolute top-24 right-24 opacity-5 floating-icon pointer-events-none">
         <AlertTriangle size={400} strokeWidth={1} />
      </div>
      <div className="absolute -bottom-40 -left-40 opacity-[0.03] pointer-events-none">
         <Activity size={600} strokeWidth={1} />
      </div>
    </div>
  );
}
