import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Monitor, 
  ChevronRight, 
  Cpu, 
  Binary,
  ShieldCheck,
  SmartphoneIcon,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Logo from '../components/common/Logo';

export default function MobileWarning() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Sequence
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });
      
      tl.from('.guard-glass', { scale: 0.95, opacity: 0, filter: 'blur(20px)' });
      tl.from('.reveal-item', { y: 20, opacity: 0, stagger: 0.1 }, "-=1");
      
      // 2. Pulse Interaction
      gsap.to('.pulse-node', {
        scale: 1.1,
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-app flex items-center justify-center p-6 relative overflow-hidden selection:bg-main selection:text-app">
      
      {/* Background Decor: Technical Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="warning-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1.5" fill="currentColor" />
            <path d="M 80 40 L 0 40 M 40 80 L 40 0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#warning-pattern)" />
        </svg>
      </div>

      <div className="guard-glass relative z-10 max-w-4xl w-full bg-panel/30 backdrop-blur-3xl border border-border-strong p-12 md:p-32 rounded-sm shadow-float flex flex-col items-center text-center gap-16 overflow-hidden">
         
         {/* Background Glow */}
         <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-blue opacity-5 blur-[120px]" />
         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-blue opacity-5 blur-[120px]" />

         {/* Shield Icon */}
         <div className="reveal-item">
            <div className="relative group">
               <div className="pulse-node absolute inset-0 bg-main/5 blur-xl rounded-full" />
               <div className="relative p-10 bg-main text-app rounded-sm shadow-premium group-hover:scale-110 transition-transform duration-1000">
                  <Logo size={56} className="text-app" />
               </div>
            </div>
         </div>

         {/* Warning Headers */}
         <div className="space-y-8 reveal-item relative z-10">
            <div className="flex items-center justify-center gap-5 text-accent-blue opacity-50">
               <AlertCircle size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Access Protocol: RESTRICTED</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tightest uppercase text-main leading-[0.9]">
               IMPROPER <br />
               <span className="text-gradient">LATTICE PORT.</span>
            </h1>
         </div>

         {/* Technical Narrative */}
         <p className="text-xl md:text-2xl font-medium text-dim opacity-70 leading-relaxed uppercase tracking-[0.05em] italic max-w-2xl reveal-item">
            The LogicLab institutional terminal is architected for precision high-density 
            gate synthesis. Mobile lattice ports do not meet the minimum resolution 
            threshold for cycle-accurate trace verification.
         </p>

         {/* Device Comparison Visual */}
         <div className="reveal-item flex flex-col items-center gap-10 w-full pt-6">
            <div className="flex items-center justify-between w-full max-w-lg">
               <div className="flex flex-col items-center gap-4 opacity-30">
                  <SmartphoneIcon size={32} strokeWidth={1} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Mobile</span>
                  <XCircle size={16} className="text-red-500" />
               </div>
               <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border-main to-transparent mx-8" />
               <div className="flex flex-col items-center gap-4">
                  <Monitor size={48} strokeWidth={1} className="text-main" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Desktop Environment</span>
                  <ShieldCheck size={16} className="text-green-500 animate-pulse" />
               </div>
            </div>

            <button 
               onClick={() => navigate('/home')}
               className="w-full md:w-auto px-20 py-8 bg-main text-app text-[11px] font-black uppercase tracking-[0.6em] rounded-sm hover:invert transition-all shadow-premium flex items-center justify-center gap-10 group"
            >
               Return to Entry Port
               <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
         </div>

         {/* Identification Footer */}
         <div className="pt-16 reveal-item flex flex-col items-center gap-4 opacity-20">
            <div className="flex items-center gap-8">
               <Cpu size={20} />
               <div className="w-12 h-[1px] bg-main" />
               <Binary size={20} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.8em]">Institutional Trace // ID_RESOLVE_FAIL</span>
         </div>
      </div>

    </div>
  );
}
