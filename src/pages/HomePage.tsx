import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Zap, 
  ArrowRight, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Binary, 
  Activity, 
  Terminal,
  Layers,
  Box,
  Share2,
  Database,
  Unplug,
  Microchip,
  Waves,
  Fingerprint
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/common/Logo';
import CircuitBackground from '../components/visuals/CircuitBackground';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set('.reveal-up', { y: 100, opacity: 0 });
      gsap.set('.reveal-scale', { scale: 0.9, opacity: 0 });
      gsap.set('.static-wire', { strokeDashoffset: 2000, strokeDasharray: 2000 });

      // 2. Hero Sequence
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 2.5 } });
      
      heroTl.to('.hero-title > span', { 
        y: 0, 
        opacity: 1, 
        stagger: 0.15,
        duration: 3
      });

      heroTl.to('.static-wire', { strokeDashoffset: 0, duration: 4, ease: 'power2.inOut', stagger: 0.2 }, "-=2.5");
      heroTl.to('.hero-reveal', { y: 0, opacity: 1, stagger: 0.1 }, "-=3");

      // 3. Scroll-Based Section Reveals
      const scrollSections = gsap.utils.toArray('.scroll-section');
      scrollSections.forEach((section: any) => {
        gsap.to(section.querySelectorAll('.reveal-on-scroll'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          duration: 2,
          stagger: 0.2,
          ease: 'expo.out'
        });

        // Parallax wires per section
        gsap.to(section.querySelectorAll('.parallax-wire'), {
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: 50,
          opacity: 0.2,
          ease: 'none'
        });
      });

      // 4. Data Flow Animations (The "Glow Pulse" effect)
      gsap.utils.toArray('.data-pulse').forEach((pulse: any, i) => {
        gsap.to(pulse, {
          strokeDashoffset: -1000,
          duration: 3 + i * 2,
          repeat: -1,
          ease: 'none'
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-app text-main selection:bg-main selection:text-app relative overflow-x-hidden">
      
      {/* --- CURVING DATA LATTICE (PERFORMANCE OPTIMIZED) --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.4]">
         <svg className="w-full h-[5000px]" viewBox="0 0 1440 5000" preserveAspectRatio="xMidYMin slice" fill="none">
            <defs>
               <filter id="motion-blur-light" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
               </filter>
               
               {/* Unified Flow Animation Styles */}
               <style>{`
                  .flow-fast { animation: flow-loop 3s linear infinite; }
                  .flow-med { animation: flow-loop 6s linear infinite; }
                  .flow-slow { animation: flow-loop 12s linear infinite; }
                  @keyframes flow-loop {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                  }
               `}</style>
            </defs>

            {/* Path 1: Primary Structural Lattice */}
            <g className="opacity-40">
               <path 
                  id="path-main-1"
                  d="M -100 200 Q 500 600 1000 200 T 2000 800 T -100 1600 T 1000 2400 T -100 3200 T 1000 4000 T -100 4800" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-dim"
               />
               <path 
                  d="M -100 200 Q 500 600 1000 200 T 2000 800 T -100 1600 T 1000 2400 T -100 3200 T 1000 4000 T -100 4800" 
                  stroke="white" 
                  strokeWidth="6" 
                  strokeDasharray="100, 900" 
                  filter="url(#motion-blur-light)"
                  className="flow-fast opacity-80" 
               />
            </g>

            {/* Path 2: Secondary Intersecting Lattice */}
            <g className="opacity-30">
               <path 
                  id="path-main-2"
                  d="M 1600 400 Q 1000 1000 400 400 T -200 1200 T 1600 2000 T 400 2800 T 1600 3600 T 400 4400" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-dim"
               />
               <path 
                  d="M 1600 400 Q 1000 1000 400 400 T -200 1200 T 1600 2000 T 400 2800 T 1600 3600 T 400 4400" 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeDasharray="150, 850" 
                  className="flow-med opacity-60" 
               />
            </g>

            {/* Path 3: Vertical Energy Channel */}
            <g className="opacity-20">
               <path 
                  d="M 400 0 C 800 500 100 1000 900 1500 T 200 2500 T 900 3500 T 200 4500" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className="text-dim"
               />
               <path 
                  d="M 400 0 C 800 500 100 1000 900 1500 T 200 2500 T 900 3500 T 200 4500" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeDasharray="50, 450" 
                  className="flow-slow" 
               />
            </g>

            {/* Sharp Terminal Micro-Pulses */}
            <path 
               d="M -100 200 Q 500 600 1000 200 T 2000 800 T -100 1600" 
               stroke="white" 
               strokeWidth="1" 
               strokeDasharray="10, 1000" 
               className="flow-fast opacity-50" 
            />
         </svg>
      </div>

      {/* Atmospheric Layout Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
        <CircuitBackground />
      </div>

      {/* --- INSTITUTIONAL NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 border-b border-border-main bg-app/80 backdrop-blur-3xl px-8 flex items-center justify-between">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/home')}>
               <Logo size={32} className="group-hover:rotate-180 transition-transform duration-700" />
               <span className="text-xl font-black uppercase tracking-tighter">LOGICLAB</span>
            </div>
            <div className="h-4 w-[1px] bg-border-main opacity-20 hidden md:block" />
            <div className="hidden md:flex items-center gap-8 text-[9px] font-black tracking-[0.4em] uppercase opacity-40">
               <span>LATTICE v12.4</span>
               <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse shadow-glow" />
               <span>SYSTEM CORE NOMINAL</span>
            </div>
         </div>

         <div className="flex items-center gap-12">
            <div className="hidden lg:flex items-center gap-10">
               {['Docs', 'Academy', 'Community', 'Sandbox'].map((item) => (
                 <button 
                  key={item} 
                  onClick={() => navigate(`/${item.toLowerCase() === 'academy' ? 'academy' : item.toLowerCase()}`)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-dim hover:text-main transition-colors relative group"
                 >
                   {item}
                   <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-main group-hover:w-full transition-all" />
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-6">
               <button 
                onClick={() => isAuthenticated ? navigate('/dashboard') : setShowAuthModal(true)}
                className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main transition-colors"
               >
                 {isAuthenticated ? 'IDENTITTY_SYNCED' : 'Sync Terminal'}
               </button>
               <button 
                onClick={() => navigate('/sandbox')}
                className="btn-premium px-8 py-3"
               >
                 Initialize Lab
               </button>
            </div>
         </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main>
        
        {/* HERO SECTION: THE PROTOCOL */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 px-8 text-center relative">
          
          <div className="max-w-7xl w-full space-y-24 relative z-10">
            <div className="hero-reveal reveal-up space-y-8">
               <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-border-main bg-white/5 backdrop-blur-md shadow-premium">
                  <Activity size={14} className="text-accent-blue animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-dim italic">Digital Synthesis Environment // Institutional Grade</span>
               </div>
               <h1 className="hero-title text-8xl md:text-[clamp(100px,18vw,260px)] font-black tracking-tightest leading-[0.75] uppercase perspective-2000 italic">
                  <span className="block opacity-0 translate-y-48">LOGIC</span>
                  <span className="block opacity-0 translate-y-48 text-gradient">SOCIETY.</span>
               </h1>
            </div>

            <div className="hero-reveal reveal-up space-y-16">
               <p className="text-2xl md:text-4xl font-black text-dim max-w-5xl mx-auto leading-tight italic opacity-60 uppercase tracking-tighter">
                 Architecting the next generation of silicon design through 
                 deterministic peer-to-peer verification and assembly synthesis.
               </p>
               <div className="flex flex-wrap justify-center gap-10">
                  <button 
                    onClick={() => navigate('/sandbox')}
                    className="btn-premium px-24 py-10 text-xs group"
                  >
                    ACCESS SIMULATION CORE
                    <Zap size={20} className="transition-transform group-hover:rotate-12 group-hover:scale-125" />
                  </button>
                  <button 
                    onClick={() => navigate('/docs')}
                    className="btn-outline-premium px-24 py-10 text-xs group"
                  >
                    RESEARCH DIRECTORY
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-4" />
                  </button>
               </div>
            </div>
          </div>

          <div className="absolute bottom-16 left-12 flex items-center gap-8 hero-reveal opacity-0 -translate-y-10">
             <div className="w-24 h-[1px] bg-main opacity-20" />
             <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.6em] opacity-40 italic">System Uptime</span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-accent-blue">99.999% STABLE</span>
             </div>
          </div>
          
          <div className="absolute bottom-16 right-12 flex flex-col items-end gap-5 hero-reveal opacity-0 -translate-y-10">
             <span className="text-[8px] font-black uppercase tracking-[0.8em] opacity-30">Lattice Trace ID: 0xFF_LOGIC</span>
             <div className="w-48 h-[1px] bg-border-main overflow-hidden">
                <div className="w-full h-full bg-main animate-shimmer" />
             </div>
          </div>
        </section>

        {/* SECTION 1: THE SILICON LATTICE (Educational) */}
        <section className="scroll-section py-80 px-8 border-y border-border-main relative bg-panel/30 backdrop-blur-3xl">
           
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-40 items-center">
              <div className="reveal-on-scroll space-y-16 opacity-0 -translate-y-10">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 text-accent-blue font-mono text-xs font-black tracking-widest">
                       <Microchip size={18} />
                       <span>0x01 // COMPUTATIONAL FABRIC</span>
                    </div>
                    <h2 className="text-7xl md:text-9xl text-main font-black tracking-tightest leading-[0.8] italic uppercase">
                       THE <br /> SILICON <br /> <span className="text-gradient">TRACE.</span>
                    </h2>
                 </div>
                 <p className="research-text text-xl">
                   At the core of LogicLab is the deterministic multi-lane lattice. 
                   We analyze signal propagation not through abstract booleans, 
                   but via a physically-mapped simulation engine.
                 </p>
                 <div className="flex gap-12 pt-8">
                    <div className="flex-1 space-y-4">
                       <span className="text-4xl font-black italic">96%</span>
                       <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 leading-relaxed italic">Verified Synthesis <br /> Accuracy threshold.</p>
                    </div>
                    <div className="flex-1 space-y-4 border-l border-border-main pl-12">
                       <span className="text-4xl font-black italic">0.0ns</span>
                       <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 leading-relaxed italic">Cycle-accurate <br /> signal propagation lag.</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1px bg-border-main border border-border-main shadow-float relative group">
                 {[
                   { 
                     title: 'Cycle-Accuracy', 
                     icon: <Activity size={24} />, 
                     text: 'Nanosecond precision signal mapping ensures that every state transition in your circuit behaves identically to real-world CMOS logic gates.' 
                   },
                   { 
                     title: 'Lattice Synthesis', 
                     icon: <Cpu size={24} />, 
                     text: 'Our WASM-backed synthesis engine processes millions of logical transitions per millisecond with zero-drop trace integrity.' 
                   },
                   { 
                     title: 'Hardware Parity', 
                     icon: <ShieldCheck size={24} />, 
                     text: 'Verify designs against hierarchical constraints, accounting for meta-stability (X) and high-impedance (Z) state hazards.' 
                   },
                   { 
                     title: 'Universal Registry', 
                     icon: <Globe size={24} />, 
                     text: 'Contribute and audit verified architectural traces within the institutional cloud registry for collaborative digital research.' 
                   }
                 ].map((card, i) => (
                   <div key={i} className="reveal-on-scroll opacity-0 translate-y-10 bg-app p-16 space-y-10 hover:bg-neutral-50 transition-all cursor-crosshair relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none italic font-black text-6xl">0{i+1}</div>
                      <div className="w-16 h-16 bg-main text-app flex items-center justify-center rounded-sm group-hover:invert transition-all duration-700 shadow-premium">
                        {card.icon}
                      </div>
                      <h4 className="text-3xl font-black italic uppercase tracking-tighter">{card.title}</h4>
                      <p className="text-[11px] font-bold text-dim opacity-70 leading-relaxed uppercase tracking-widest italic">
                        {card.text}
                      </p>
                      <div className="absolute left-0 bottom-0 w-full h-[1px] bg-border-main scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 2: THE SYNERGY (Life-like Dynamics) */}
        <section className="scroll-section py-80 px-8 relative overflow-hidden">
           
           {/* Section Decor: Strength Wires */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
              <svg className="w-full h-full" viewBox="0 0 1000 1000">
                 <path className="parallax-wire" d="M 500 0 C 400 300 600 700 500 1000" stroke="currentColor" strokeWidth="1" fill="none" />
                 <path className="parallax-wire" d="M 0 500 C 300 400 700 600 1000 500" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
           </div>

           <div className="max-w-7xl mx-auto flex flex-col gap-40 relative z-10">
              
              <div className="text-center space-y-10 reveal-on-scroll opacity-0 translate-y-10">
                 <div className="flex items-center justify-center gap-8 text-dim opacity-20">
                    <Layers size={40} strokeWidth={1} />
                    <div className="w-[1px] h-16 bg-main" />
                    <Unplug size={40} strokeWidth={1} />
                 </div>
                 <h2 className="text-8xl md:text-[10vw] font-black tracking-tightest leading-[0.8] uppercase italic">
                    HIERARCHICAL <br /> 
                    <span className="text-gradient">LATTICE.</span>
                 </h2>
                 <p className="text-2xl font-black text-dim max-w-2xl mx-auto italic opacity-50 leading-relaxed uppercase tracking-tight">
                   Encapsulate enormous gate structures into persistent, 
                   optimized integrated circuits with zero overhead.
                 </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                 <div className="reveal-on-scroll opacity-0 -translate-x-10">
                    <div className="hardware-card p-20 space-y-16 relative group cursor-none overflow-hidden hover:scale-[1.02]">
                       <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-blue animate-shimmer" />
                       <div className="flex justify-between items-start">
                          <div className="space-y-4">
                             <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Tracing_Operational</span>
                             </div>
                             <h4 className="text-4xl font-black tracking-tighter uppercase italic">ASIC SYNTHESIS</h4>
                          </div>
                          <Terminal size={32} strokeWidth={1} className="opacity-20" />
                       </div>
                       
                       <div className="space-y-10">
                          <div className="space-y-4">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">
                                <span>Synthesis Load</span>
                                <span>99.2% Stable</span>
                             </div>
                             <div className="h-1 w-full bg-border-main relative overflow-hidden">
                                <div className="absolute left-0 top-0 h-full w-[92%] bg-main shadow-[0_0_20px_var(--color-main)]" />
                                <div className="absolute left-0 top-0 h-full w-full bg-white/20 animate-fast-flow" />
                             </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 h-16">
                             {[1,2,3,4].map(i => (
                               <div key={i} className="border border-border-main flex items-center justify-center group-hover:bg-main group-hover:text-app transition-all duration-700 bg-white/5 backdrop-blur-md">
                                  <Binary size={18} strokeWidth={1} />
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="flex items-center gap-6 pt-10">
                          <div className="w-12 h-12 rounded-full border border-border-main flex items-center justify-center">
                             <Fingerprint size={20} className="text-accent-blue" />
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[8px] font-black uppercase tracking-widest opacity-30 italic">Lattice Admin</span>
                             <span className="text-[10px] font-black uppercase tracking-widest">VERIFIED_TRACE_77-AX</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="reveal-on-scroll opacity-0 translate-x-10 text-left space-y-16">
                    <div className="space-y-8">
                       <h3 className="text-5xl font-black italic tracking-tightest uppercase leading-none">THE ARCHITECTURAL <br /> PERSISTENCE ENGINE.</h3>
                       <p className="research-text text-xl">
                         Our methodology allows engineers to define instruction sets, op-codes, 
                         and memory hierarchies with total mathematical certainty. 
                         Every module contributed is persistent and reusable.
                       </p>
                    </div>
                    <ul className="space-y-8">
                       {[
                         { title: 'Deterministic Instruction Paths', icon: <Zap size={20} /> },
                         { title: 'Recursive Silicon Encapsulation', icon: <Box size={20} /> },
                         { title: 'Global Academic Registry Sync', icon: <Globe size={20} /> },
                         { title: 'High-Density Integrated Patterns', icon: <Waves size={20} /> }
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-8 group cursor-pointer">
                            <div className="w-12 h-12 border border-border-main flex items-center justify-center group-hover:bg-main group-hover:text-app transition-all shadow-premium">
                               {item.icon}
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-dim group-hover:text-main transition-colors italic">{item.title}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 3: THE REASONING (New Content Block) */}
        <section className="scroll-section py-80 px-8 bg-main text-app relative overflow-hidden">
           <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 1000 1000">
                 <pattern id="lattice-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#lattice-pattern)" />
              </svg>
           </div>

           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-40 items-center relative z-10">
              <div className="reveal-on-scroll opacity-0 -translate-x-10 space-y-20">
                 <div className="space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-[1em] text-accent-blue italic">Verification Protocol // Institutional</span>
                    <h2 className="text-7xl md:text-9xl font-black italic tracking-tightest leading-[0.8] uppercase">
                       DETERMINISTIC <br /> <span className="opacity-40">SOVEREIGNTY.</span>
                    </h2>
                 </div>
                 <p className="text-2xl font-medium opacity-60 leading-relaxed italic max-w-4xl uppercase tracking-tighter">
                   LogicLab is built for those who require absolute precision. 
                   No random states, no uninitialized hazards—only the pure law of logic gates 
                   operating in perfect synchronicity.
                 </p>
                 <div className="flex gap-16">
                    <div className="space-y-4">
                       <Database size={40} strokeWidth={1} />
                       <h5 className="text-sm font-black uppercase tracking-widest italic">Massive Registry</h5>
                    </div>
                    <div className="space-y-4">
                       <ShieldCheck size={40} strokeWidth={1} />
                       <h5 className="text-sm font-black uppercase tracking-widest italic">Peer Verification</h5>
                    </div>
                    <div className="space-y-4">
                       <Cpu size={40} strokeWidth={1} />
                       <h5 className="text-sm font-black uppercase tracking-widest italic">Cycle Accuracy</h5>
                    </div>
                 </div>
              </div>
              <div className="reveal-on-scroll opacity-0 translate-x-10">
                 <div className="p-20 border border-app/20 bg-white/5 backdrop-blur-3xl rounded-sm space-y-12 italic">
                    <Logo size={120} className="invert opacity-20" />
                    <h4 className="text-3xl font-black uppercase tracking-tightest leading-tight">THE ACADEMY IS OPEN.</h4>
                    <p className="text-sm opacity-50 font-medium uppercase tracking-widest leading-loose">
                       Begin your journey into the world of complex digital systems. 
                       Learn the patterns of the silicon masters.
                    </p>
                    <button 
                       onClick={() => navigate('/learn')}
                       className="w-full py-8 bg-app text-main font-black uppercase tracking-[0.4em] text-[10px] hover:invert transition-all"
                    >
                       ENROLL IN ACADEMY
                    </button>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 4: THE CALL (Cinematic) */}
        <section className="scroll-section py-80 px-8 text-center relative overflow-hidden bg-app">
           
           <div className="max-w-5xl mx-auto space-y-20 relative z-10">
              <div className="reveal-on-scroll opacity-0 scale-90 space-y-8">
                 <div className="flex justify-center gap-6 opacity-20 items-center">
                    <Share2 size={24} />
                    <div className="w-16 h-[1px] bg-main" />
                    <Unplug size={24} />
                 </div>
                 <h2 className="text-8xl md:text-[min(15vw,260px)] font-black tracking-tightest leading-[0.7] uppercase italic">
                    LEAVE YOUR <br /> <span className="text-gradient">TRACE.</span>
                 </h2>
              </div>
              
              <div className="reveal-on-scroll opacity-0 translate-y-10 space-y-16">
                 <p className="text-2xl md:text-3xl font-black text-dim max-w-2xl mx-auto leading-tight uppercase tracking-widest italic opacity-40">
                   Synchronize your architectural states with the global institutional lattice.
                 </p>
                 <div className="flex flex-wrap justify-center gap-10">
                    <button 
                      onClick={() => navigate('/sandbox')}
                      className="px-24 py-10 bg-main text-app font-black uppercase tracking-[0.6em] text-[11px] hover:invert transition-all flex items-center gap-10 shadow-float group"
                    >
                      INITIALIZE SIMULATION
                      <Zap size={22} className="group-hover:rotate-12 transition-transform" />
                    </button>
                    <button 
                      onClick={() => navigate('/docs')}
                      className="px-24 py-10 border border-border-strong text-main font-black uppercase tracking-[0.6em] text-[11px] hover:bg-main hover:text-app transition-all flex items-center gap-10 group"
                    >
                      RESEARCH DATA
                      <ArrowRight size={22} className="group-hover:translate-x-4 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>

           <Logo size={800} className="absolute -right-64 -bottom-64 opacity-[0.02] rotate-[20deg] pointer-events-none" />
        </section>

      </main>

      {/* --- INSTITUTIONAL FOOTER --- */}
      <footer className="py-60 px-8 border-t border-border-main bg-panel relative z-40">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-24">
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                  <Logo size={48} />
                  <span className="text-3xl font-black uppercase tracking-tighter">LOGICLAB</span>
               </div>
               <p className="text-sm font-bold text-dim max-w-xs opacity-50 uppercase tracking-widest italic leading-loose">
                 Institutional-grade digital logic synthesis for verification 
                 specialists and computer architecture scholars.
               </p>
               <div className="flex items-center gap-8">
                  {[Share2, Database, Globe, Terminal].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 border border-border-main flex items-center justify-center hover:bg-main hover:text-app transition-all shadow-premium group">
                       <Icon size={20} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-10 text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 italic">Lattice Registry</h4>
               <nav className="flex flex-col gap-6">
                  {['Laboratory', 'Verified Primitive', 'Shared Assets', 'Terminal Log', 'State Registry'].map(item => (
                    <button key={item} className="text-[11px] font-black uppercase tracking-[0.2em] text-dim hover:text-main text-left transition-colors italic">{item}</button>
                  ))}
               </nav>
            </div>

            <div className="space-y-10 text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 italic">Academy Directory</h4>
               <nav className="flex flex-col gap-6">
                  {['Syllabus', 'Peer Review', 'Stability Hub', 'Verification', 'Standards'].map(item => (
                    <button key={item} className="text-[11px] font-black uppercase tracking-[0.2em] text-dim hover:text-main text-left transition-colors italic">{item}</button>
                  ))}
               </nav>
            </div>

            <div className="space-y-10 text-left">
               <h4 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 italic">Connectivity</h4>
               <nav className="flex flex-col gap-6">
                  {['Cloud Sync', 'Institutional SSO', 'Lattice API', 'Terminal v12'].map(item => (
                    <button key={item} className="text-[11px] font-black uppercase tracking-[0.2em] text-dim hover:text-main text-left transition-colors italic">{item}</button>
                  ))}
               </nav>
            </div>
         </div>

         <div className="max-w-7xl mx-auto pt-40 mt-32 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.6em] text-dim opacity-30 italic">
               <span>&copy; 2026 LOGICLAB PROTOCOL</span>
               <div className="w-2 h-2 rounded-full bg-main" />
               <span>CYCLE-STABLE_ENV_V12</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-green-500 bg-green-500/5 px-6 py-2 border border-green-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                  PERSISTENT_SYNC_ON
               </div>
               <span className="text-[10px] font-mono font-bold tracking-widest text-dim opacity-30">V12.4.08_SYNTHESIS</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
