import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Logo from '../components/common/Logo';
import {
  Layers,
  ArrowRight,
  Zap,
  Binary,
  ShieldCheck,
  Globe,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);
  
  const heroRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mastering Entrance Animation
      const tl = gsap.timeline();

      tl.from('.nav-reveal', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1
      });

      tl.from([title1Ref.current, title2Ref.current], {
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.2
      }, "-=0.5");

      tl.from('.hero-p', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, "-=1");

      tl.from('.hero-btn', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.1
      }, "-=0.8");

      tl.from('.bento-item', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out'
      }, "-=1");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-app text-main selection:bg-main selection:text-app overflow-x-hidden" ref={heroRef}>
      {/* High-Prestige Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-app/80 backdrop-blur-3xl border-b border-border-main transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="nav-reveal flex items-center gap-6">
            <Logo size={36} className="hover:rotate-12 transition-transform duration-700" />
            <div className="h-6 w-[1px] bg-border-main hidden sm:block opacity-20" />
            <span className="text-2xl font-black tracking-tighter hidden sm:block uppercase">LOGICLAB</span>
          </div>

          <div className="nav-reveal hidden lg:flex items-center gap-12">
            <button onClick={() => navigate('/docs')} className="text-[10px] font-black uppercase tracking-[0.3em] text-dim hover:text-main transition-colors">Documentation</button>
            <button onClick={() => navigate('/learn')} className="text-[10px] font-black uppercase tracking-[0.3em] text-dim hover:text-main transition-colors">Academy</button>
            <button onClick={() => navigate('/community')} className="text-[10px] font-black uppercase tracking-[0.3em] text-dim hover:text-main transition-colors">Community</button>
          </div>

          <div className="nav-reveal flex items-center gap-6">
            {!isAuthenticated ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main transition-all"
              >
                Sync Terminal
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main flex items-center gap-3 transition-all"
              >
                Registry <ArrowRight size={12} />
              </button>
            )}
            <button
               onClick={() => navigate('/sandbox')}
               className="btn-premium py-2.5 px-8"
            >
              Initialize Node
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-48 pb-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* Elite Hero Section */}
          <div className="flex flex-col items-start text-left mb-60">
            <div className="hero-p inline-flex items-center gap-3 px-4 py-1.5 rounded-sm border border-border-main text-[9px] font-black uppercase tracking-[0.4em] text-dim mb-12 bg-neutral-50/50">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              High Precision Logic Verification Hub
            </div>
            
            <div className="mb-12 space-y-4">
               <h1 ref={title1Ref} className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.8] uppercase reveal-text">
                 COMPUTATIONAL
               </h1>
               <h1 ref={title2Ref} className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.8] uppercase opacity-20 italic">
                 LOGIC, REFINED.
               </h1>
            </div>
            
            <p className="hero-p text-3xl text-dim font-medium leading-tight max-w-3xl mb-16 tracking-tight">
              An institutional-grade research environment for <br />
              <span className="text-main italic font-bold">digital systems, neuromorphic simulation, and hardware theory.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
               <button
                 onClick={() => navigate('/sandbox')}
                 className="hero-btn btn-premium px-16 py-6 text-xs uppercase tracking-[0.3em] font-black"
               >
                 Launch Laboratory
               </button>
               <button
                 onClick={() => navigate('/docs')}
                 className="hero-btn btn-outline-premium px-16 py-6 text-xs uppercase tracking-[0.3em] font-black group"
               >
                 Read Whitepaper <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
               </button>
            </div>
          </div>

          {/* Precision Bento Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-1px bg-border-main border border-border-main shadow-premium overflow-hidden">
            <div className="bento-item md:col-span-8 bg-app p-16 flex flex-col justify-end group cursor-pointer relative overflow-hidden h-[400px]">
               <Layers className="absolute -right-12 -top-12 w-64 h-64 text-main opacity-[0.03] group-hover:scale-110 transition-transform duration-1000" />
               <div className="relative z-10 transition-transform duration-700 group-hover:translate-x-4">
                 <h3 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">Hierarchical <br />Architecture</h3>
                 <p className="text-xl text-dim max-w-xl font-medium leading-relaxed opacity-60">
                   Infinite recursion depth. Transform massive gate arrays into encapsulated IC nodes 
                   for industrial-scale logical verification.
                 </p>
               </div>
               <div className="absolute left-0 bottom-0 w-2 h-full bg-main scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
            </div>
            
            <div className="bento-item md:col-span-4 bg-main p-16 flex flex-col justify-end group cursor-pointer relative overflow-hidden h-[400px]">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
               <Zap className="w-16 h-16 text-app mb-12 transition-transform duration-700 group-hover:rotate-12" />
               <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-app">Deterministic Core</h3>
               <p className="text-sm text-app opacity-40 font-medium leading-relaxed uppercase tracking-widest">
                 nanosecond precision signal propagation lattice.
               </p>
            </div>

            <div className="bento-item md:col-span-4 bg-app p-16 flex flex-col justify-end group cursor-pointer relative h-[380px]">
               <Binary className="w-12 h-12 mb-12 text-dim opacity-30 group-hover:text-main group-hover:opacity-100 transition-all" />
               <h4 className="text-3xl font-black uppercase tracking-tighter mb-4">Academic Grade</h4>
               <p className="text-sm font-black uppercase tracking-[0.2em] text-dim opacity-40">100% Free Peer Materials</p>
               <div className="mt-8 flex gap-2">
                 {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-border-main group-hover:bg-main transition-colors" />)}
               </div>
            </div>

            <div className="bento-item md:col-span-8 bg-app p-16 flex flex-col md:flex-row items-center justify-between gap-16 group h-[380px]">
               <div className="flex flex-col justify-center transition-transform duration-700 group-hover:translate-x-4">
                  <h3 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">Collaborative <br />Verification</h3>
                  <p className="text-xl text-dim font-medium max-w-md leading-relaxed opacity-60">
                    Host shared logical lattices for secure institutional research and peer review.
                  </p>
               </div>
               <div className="w-40 h-40 flex items-center justify-center border border-border-main rounded-sm group-hover:border-main transition-all duration-700 hover:rotate-45 bg-neutral-50/50">
                  <ShieldCheck className="w-16 h-16 text-dim group-hover:text-main transition-colors" />
               </div>
            </div>
          </div>

          {/* Institutional Outro */}
          <div className="mt-60 py-40 border-t border-border-main text-center">
             <h2 className="text-8xl font-black uppercase tracking-tighter mb-12 reveal-text">Ready to initialize?</h2>
             <button
               onClick={() => navigate('/sandbox')}
               className="btn-premium px-24 py-10 text-lg uppercase tracking-[0.5em] font-black hover:scale-105 active:scale-95 shadow-float"
             >
               Enter the Lab
             </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-main bg-neutral-50/50 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          <div className="flex flex-col gap-12">
            <div className="flex items-center gap-4">
              <Logo size={40} />
              <span className="text-3xl font-black tracking-tighter uppercase">LOGICLAB</span>
            </div>
            <p className="text-sm text-dim leading-relaxed font-medium opacity-60">
              Advancing the science of hardware simulation. High-performance verification 
              running natively in the architecture of the modern web.
            </p>
            <div className="flex gap-4">
               <div className="w-12 h-12 border border-border-main flex items-center justify-center rounded-sm hover:border-main hover:bg-app transition-all cursor-pointer shadow-sm"><Globe size={20} className="opacity-40" /></div>
               <div className="w-12 h-12 border border-border-main flex items-center justify-center rounded-sm hover:border-main hover:bg-app transition-all cursor-pointer shadow-sm"><Binary size={20} className="opacity-40" /></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-dim opacity-50 italic">System Nodes</h4>
            <nav className="flex flex-col gap-5 text-sm font-black">
              <button onClick={() => navigate('/sandbox')} className="text-dim hover:text-main text-left uppercase tracking-widest text-[10px]">Sandbox Environment</button>
              <button onClick={() => navigate('/learn')} className="text-dim hover:text-main text-left uppercase tracking-widest text-[10px]">The Academy</button>
              <button onClick={() => navigate('/docs')} className="text-dim hover:text-main text-left uppercase tracking-widest text-[10px]">Infrastructure Docs</button>
              <button onClick={() => navigate('/community')} className="text-dim hover:text-main text-left uppercase tracking-widest text-[10px]">Circuit Registry</button>
            </nav>
          </div>

          <div className="flex flex-col gap-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-dim opacity-50 italic">Research</h4>
            <nav className="flex flex-col gap-5 text-sm font-black opacity-30">
              <button className="text-dim text-left uppercase tracking-widest text-[10px] cursor-not-allowed">Quantum Gates</button>
              <button className="text-dim text-left uppercase tracking-widest text-[10px] cursor-not-allowed">Neuromorphic LIF</button>
              <button className="text-dim text-left uppercase tracking-widest text-[10px] cursor-not-allowed">ASIC Synthesis</button>
              <button className="text-dim text-left uppercase tracking-widest text-[10px] cursor-not-allowed">VHDL Verification</button>
            </nav>
          </div>

          <div className="flex flex-col gap-10">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-dim opacity-50 italic">Terminal Status</h4>
              <div className="p-8 border border-border-main bg-app rounded-sm shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-main">Grid Nominal</span>
                   </div>
                   <span className="text-[9px] font-black text-dim opacity-30">99.9%</span>
                </div>
                <div className="w-full h-1 bg-neutral-100 relative overflow-hidden">
                   <div className="absolute left-0 top-0 h-full bg-main w-[85%] animate-[shimmer_2s_infinite]" />
                </div>
                <p className="text-[9px] text-dim font-bold uppercase tracking-widest leading-relaxed opacity-40 text-center">
                  Global CDN Lattice Active. <br />Handshake verified.
                </p>
              </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-border-main flex justify-between items-center">
           <span className="text-[9px] font-black uppercase tracking-[0.56em] text-dim opacity-30">© 2026 LogicLab Institutional Systems</span>
           <span className="text-[9px] font-black uppercase tracking-[0.56em] text-dim opacity-30">Precision // Determinism // Zero-State</span>
        </div>
      </footer>
    </div>
  );
}
