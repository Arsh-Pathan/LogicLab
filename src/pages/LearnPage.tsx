import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  BookOpen, 
  Binary, 
  Cpu, 
  Terminal, 
  Zap, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Microchip,
  GraduationCap
} from 'lucide-react';
import Logo from '../components/common/Logo';
import CircuitBackground from '../components/visuals/CircuitBackground';

gsap.registerPlugin(ScrollTrigger);

const ACADEMY_CURRICULUM = [
  {
    level: 'Lattice Alpha',
    title: 'Foundational Logic',
    desc: 'The prerequisite for all digital architectural research.',
    modules: [
      { id: 'binary', title: 'The Binary State', text: 'Modeling deterministic true/false lattices and high-impedance states.' },
      { id: 'gates', title: 'Primal Gate Synthesis', text: 'Analyzing signal propagation across AND, OR, and NOT primitives.' },
      { id: 'timing', title: 'Propagation Timing', text: 'Understanding gate delays, setup times, and hold constraints.' }
    ]
  },
  {
    level: 'Lattice Beta',
    title: 'Combinational Systems',
    desc: 'Synthesizing complex stateless architectures with perfect precision.',
    modules: [
      { id: 'arithmetic', title: 'Arithmetic Units', text: 'Designing full-adders, carry-lookahead structures, and multipliers.' },
      { id: 'encoding', title: 'Decoding & Multiplexing', text: 'Managing multi-lane signal routing and addressing protocols.' },
      { id: 'hazards', title: 'Static Hazard Analysis', text: 'Detecting glitches and race conditions in stateless paths.' }
    ]
  },
  {
    level: 'Lattice Gamma',
    title: 'Sequential Mastery',
    desc: 'Understanding time-dependent states and memory hierarchies.',
    modules: [
      { id: 'flipflops', title: 'Memory Primitives', text: 'Latches, Flip-Flops, and the fundamental physics of data persistence.' },
      { id: 'fsm', title: 'Finite State Machines', text: 'Architecting deterministic state transitions for complex control logic.' },
      { id: 'registers', title: 'Register Files', text: 'Designing high-density static RAM and register-transfer lattices.' }
    ]
  }
];

export default function LearnPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Technical Reveal
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });
      
      tl.from('.academy-header', { y: 40, opacity: 0 });
      tl.from('.reveal-item', { y: 30, opacity: 0, stagger: 0.1 }, "-=1");

      // 2. Scroll Reveals
      gsap.utils.toArray('.curriculum-section').forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 60,
          opacity: 0,
          duration: 1.5,
          ease: 'power4.out'
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-app text-main selection:bg-main selection:text-app relative overflow-x-hidden">
      
      {/* Background Decor Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
         <CircuitBackground />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 border-b border-border-main bg-app/80 backdrop-blur-3xl px-8 flex items-center justify-between">
         <div className="flex items-center gap-6 cursor-pointer group" onClick={() => navigate('/home')}>
            <Logo size={28} className="group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-xl font-black uppercase tracking-tighter">LOGICLAB</span>
         </div>
         <div className="flex items-center gap-10">
            <button onClick={() => navigate('/docs')} className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main">Academy</button>
            <button onClick={() => navigate('/sandbox')} className="btn-premium px-8 py-3">Enter Registry</button>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-48 space-y-48 relative z-10">
         
         {/* Academy Header Port */}
         <header className="academy-header space-y-12">
            <div className="flex items-center gap-6 text-dim opacity-30">
               <GraduationCap size={40} strokeWidth={1} />
               <div className="w-[1px] h-16 bg-main" />
               <BookOpen size={40} strokeWidth={1} />
            </div>
            <div className="space-y-6">
               <h1 className="text-8xl md:text-9xl font-black tracking-tightest leading-none uppercase italic">
                  THE <br /> <span className="text-gradient">ACADEMY.</span>
               </h1>
               <p className="text-2xl font-medium text-dim max-w-2xl leading-snug italic opacity-60 uppercase tracking-widest italic">
                  Advanced scholarly curriculum for high-fidelity logic synthesis. 
                  Master the architecture of the silicon lattice.
               </p>
            </div>
         </header>

         {/* Curriculum Directory */}
         <div className="space-y-40">
            {ACADEMY_CURRICULUM.map((section, idx) => (
               <section key={section.title} className="curriculum-section space-y-20">
                  <div className="flex items-end justify-between border-b border-border-main pb-12">
                     <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-accent-blue italic">{section.level}</span>
                        <h2 className="text-5xl md:text-6xl text-main font-black tracking-tight uppercase italic">{section.title}</h2>
                        <p className="text-lg font-bold text-dim opacity-40 uppercase tracking-widest italic">{section.desc}</p>
                     </div>
                     <div className="text-dim opacity-20 hidden md:block">
                        <span className="text-9xl font-black lowercase opacity-10">0{idx + 1}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-border-main border border-border-main shadow-float overflow-hidden">
                     {section.modules.map((module) => (
                        <div key={module.id} className="bg-app p-12 space-y-12 group hover:bg-neutral-50 transition-colors cursor-crosshair relative overflow-hidden">
                           <div className="flex justify-between items-start">
                              <div className="w-14 h-14 bg-main text-app flex items-center justify-center rounded-sm shadow-premium group-hover:scale-110 transition-transform duration-700">
                                 {module.id === 'binary' ? <Binary size={24} /> : module.id === 'gates' ? <Microchip size={24} /> : <Activity size={24} />}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">Module Active</span>
                           </div>
                           
                           <div className="space-y-6">
                              <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">{module.title}</h3>
                              <p className="text-sm font-medium text-dim opacity-60 leading-relaxed uppercase tracking-widest italic group-hover:opacity-100 transition-opacity">
                                 {module.text}
                              </p>
                           </div>

                           <div className="pt-8 border-t border-border-main flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                                 <ShieldCheck size={12} className="text-green-500" />
                                 <span>Academic Grade</span>
                              </div>
                              <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-main hover:gap-6 transition-all">
                                 Begin <ArrowRight size={14} />
                              </button>
                           </div>

                           {/* Technical Background Number */}
                           <div className="absolute right-4 top-4 text-4xl font-black italic opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                              {module.id.slice(0, 2).toUpperCase()}
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            ))}
         </div>

         {/* Scholars Call */}
         <section className="reveal-item py-40 bg-main text-app text-center space-y-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:40px_40px]" />
            <div className="relative z-10 space-y-8">
               <h2 className="text-7xl font-black italic tracking-tightest uppercase">Ready to <br /> graduate?</h2>
               <p className="text-xl font-medium opacity-60 max-w-xl mx-auto leading-relaxed uppercase tracking-widest italic">
                  Combine your academy knowledge to build persistent architectural patterns 
                  and contribute to the peer-reviewed registry.
               </p>
               <button 
                  onClick={() => navigate('/sandbox')}
                  className="px-20 py-8 bg-app text-main font-black uppercase tracking-[0.5em] text-xs hover:invert transition-all flex items-center gap-8 shadow-2xl mx-auto group"
               >
                  ENTER TERMINAL PORT
                  <Zap size={20} className="group-hover:rotate-12 transition-transform" />
               </button>
            </div>
         </section>

      </main>

      <footer className="py-24 border-t border-border-main text-center opacity-30 italic">
         <div className="flex justify-center gap-8 mb-6">
            <Layers size={20} />
            <Terminal size={20} />
            <Cpu size={20} />
         </div>
         <span className="text-[9px] font-black uppercase tracking-[0.8em]">Institutional Syllabus // TR-STABLE</span>
      </footer>

    </div>
  );
}
