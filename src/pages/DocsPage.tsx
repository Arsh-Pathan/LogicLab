import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Cpu, 
  Zap, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Binary, 
  Microchip, 
  Globe,
  ArrowRight,
  ChevronRight,
  Database,
  Unplug
} from 'lucide-react';
import Logo from '../components/common/Logo';
import CircuitBackground from '../components/visuals/CircuitBackground';

gsap.registerPlugin(ScrollTrigger);

const DOCS_STRUCTURE = [
  {
    category: 'Institutional Core',
    items: [
      { id: 'philosophy', title: 'Deterministic Philosophy', sub: 'The science of absolute predictability in logic synthesis.' },
      { id: 'lattice', title: 'Silicon Lattice Model', sub: 'Understanding the physically-mapped propagation fabric.' },
      { id: 'wasm', title: 'WASM Synthesis Engine', sub: 'Near-native execution of massive gate arrays.' }
    ]
  },
  {
    category: 'Primal Gates',
    items: [
      { id: 'logic-standard', title: 'IEEE Logic Standards', sub: 'Mapping 0, 1, Z, and X states in the laboratory.' },
      { id: 'propagation', title: 'Propagation Physics', sub: 'Nanosecond timing, parasitic capacitance, and gate delay.' },
      { id: 'hazards', title: 'Static & Dynamic Hazards', sub: 'Detecting race conditions and glitches in the lattice.' }
    ]
  },
  {
    category: 'Architectures',
    items: [
      { id: 'hierarchies', title: 'Hierarchical Encapsulation', sub: 'Wrapping complex lattices into persistent modules.' },
      { id: 'registry', title: 'Global Module Registry', sub: 'Contributing verified architectural traces to the cloud.' },
      { id: 'asic', title: 'Virtual ASIC Synthesis', sub: 'Prototyping instruction sets and instruction-ready modules.' }
    ]
  }
];

export default function DocsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('philosophy');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });
      tl.from('.docs-sidebar', { x: -50, opacity: 0 });
      tl.from('.docs-content-wrapper', { y: 30, opacity: 0 }, "-=1");
      
      // 2. Technical Wires
      gsap.to('.docs-wire', {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-app text-main selection:bg-main selection:text-app relative flex">
      
      {/* --- SIDEBAR: TRACE DIRECTORY --- */}
      <aside className="docs-sidebar w-[380px] border-r border-border-main sticky top-0 h-screen hidden xl:flex flex-col bg-app/50 backdrop-blur-3xl z-40 p-10 gap-16 overflow-y-auto">
         <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <Logo size={28} />
            <span className="text-lg font-black uppercase tracking-tighter">LOGICLAB</span>
         </div>

         <div className="space-y-4">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-dim opacity-40 italic">Query Registry</span>
            <div className="relative group">
               <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-30 group-focus-within:opacity-100 transition-opacity" />
               <input 
                  type="text" 
                  placeholder="PROTOCOL_ID..." 
                  className="w-full bg-white/5 border border-border-main rounded-sm py-4 pl-14 pr-4 text-[10px] font-black tracking-widest outline-none focus:border-main transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         <nav className="flex flex-col gap-12">
            {DOCS_STRUCTURE.map((group, i) => (
              <div key={i} className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-[1px] bg-main opacity-20" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{group.category}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`group text-left p-4 rounded-sm transition-all border border-transparent flex flex-col gap-1 ${activeSection === item.id ? 'bg-main text-app border-main shadow-premium' : 'hover:bg-white/5 hover:border-border-main'}`}
                      >
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.title}</span>
                            <ChevronRight size={12} className={`opacity-20 group-hover:translate-x-1 transition-transform ${activeSection === item.id ? 'opacity-100 invert' : ''}`} />
                         </div>
                         <span className={`text-[8px] font-medium opacity-40 uppercase tracking-tighter line-clamp-1 ${activeSection === item.id ? 'opacity-70 invert' : ''}`}>{item.sub}</span>
                      </button>
                    ))}
                 </div>
              </div>
            ))}
         </nav>

         <div className="mt-auto pt-10 border-t border-border-main flex flex-col gap-4 opacity-30 italic">
            <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.6em]">
               <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
               Lattice Synced
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">v12.4_ACADEMY</span>
         </div>
      </aside>

      {/* --- CONTENT: THE MANUSCRIPT --- */}
      <main className="flex-1 docs-content-wrapper min-h-screen px-6 md:px-20 py-32 relative">
         <div className="max-w-4xl mx-auto space-y-40">
            
            {/* ARTICLE HEADER */}
            <header className="space-y-12">
               <div className="flex items-center gap-6">
                  <Activity size={32} strokeWidth={1} className="text-accent-blue" />
                  <div className="h-[1px] flex-1 bg-border-main" />
               </div>
               <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.8em] text-accent-blue italic">Institutional Whitepaper // P_0x{activeSection.length}</span>
                  <h1 className="text-7xl md:text-9xl font-black tracking-tightest leading-none uppercase italic">
                    {DOCS_STRUCTURE.flatMap(g => g.items).find(i => i.id === activeSection)?.title || 'Academy'}
                  </h1>
               </div>
               <p className="text-2xl font-medium text-dim italic opacity-70 leading-relaxed uppercase tracking-widest">
                 {DOCS_STRUCTURE.flatMap(g => g.items).find(i => i.id === activeSection)?.sub}
               </p>
            </header>

            {/* ARTICLE CONTENT (Mock Detailed Text) */}
            <div className="space-y-24">
               
               <section className="space-y-10">
                  <h3 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                    <span className="text-accent-blue opacity-50">#</span> 01_SYNTHESIS_MODELS
                  </h3>
                  <p className="research-text">
                    LogicLab utilizes a **Deterministic Event-Driven Engine** to simulate the behavior of digital circuits. Unlike simplistic boolean evaluations found in traditional simulators, our system maps every logical primitive to a high-fidelity physical lattice. This lattice accounts for the **Physics of Propagation**, where signal integrity is maintained through multi-port observation nodes.
                  </p>
                  <p className="research-text">
                    In this laboratory environment, a "Digital Gate" is not just a mathematical operator but a silicon-layer abstraction. Every AND, OR, and NOT gate models real-world propagation delay, capacitance hazards, and voltage thresholds (theoretical).
                  </p>
               </section>

               {/* TECHNICAL DIAGRAM MOCK */}
               <div className="hardware-card bg-white/5 border border-border-main rounded-sm p-12 relative overflow-hidden group">
                  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 400 400">
                     <path className="docs-wire" d="M 0 50 H 100 V 150 H 300 V 250 H 400" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="1000" strokeDashoffset="1000" />
                     <path className="docs-wire" d="M 0 350 H 100 V 250 H 300 V 150 H 400" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="1000" strokeDashoffset="1000" />
                  </svg>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                     <div className="w-full md:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-sm border border-border-main text-[8px] font-black uppercase tracking-widest italic opacity-40">
                           <ShieldCheck size={10} />
                           Integrity Verified
                        </div>
                        <h4 className="text-2xl font-black tracking-tighter italic">LATTICE_TRACE_ID_442</h4>
                        <p className="text-[10px] font-medium text-dim uppercase tracking-[0.2em] leading-relaxed italic">
                           Visualizing the intersection of the primary and secondary propagation paths under native WASM synthesis load.
                        </p>
                     </div>
                     <div className="w-full md:w-1/2 flex justify-center">
                        <div className="w-48 h-48 border border-border-main rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform duration-1000">
                           <div className="absolute inset-0 border border-dotted border-border-main animate-[spin_20s_linear_infinite] rounded-full" />
                           <Binary size={48} className="text-main opacity-20" />
                        </div>
                     </div>
                  </div>
               </div>

               <section className="space-y-10">
                  <h3 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                    <span className="text-accent-blue opacity-50">#</span> 02_ASIC_PROTOCOL
                  </h3>
                  <p className="research-text">
                    The LogicLab instruction set allows researchers to protoype entire Application-Specific Integrated Circuits (ASICs). By using **Hierarchical Encapsulation**, designers can combine primal gates into massive state machines with zero performance penalty. Each encapsulated module is assigned a unique **Lattice Address**, facilitating peer-review and global collaboration via the registry.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                     {[
                       { title: 'Zero Jitter', icon: <Zap /> },
                       { title: 'Peer Review', icon: <Globe /> },
                       { title: 'WASM Native', icon: <Cpu /> }
                     ].map((item, i) => (
                       <div key={i} className="p-6 border border-border-main rounded-sm space-y-4 hover:border-main transition-colors group">
                          <div className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity">
                             {item.icon}
                          </div>
                          <span className="block text-[10px] font-black uppercase tracking-widest">{item.title}</span>
                       </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-10">
                  <h3 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                    <span className="text-accent-blue opacity-50">#</span> 03_SCHOLARLY_CONTRIBUTION
                  </h3>
                  <p className="research-text italic opacity-50">
                    "The contribution of architectural primitives to the global registry is the cornerstone of shared digital research. Every trace verified in the laboratory increases the collective intelligence of the logical lattice."
                  </p>
                  <div className="pt-12">
                     <button 
                        onClick={() => navigate('/community')}
                        className="px-16 py-8 border border-main text-main font-black uppercase tracking-[0.5em] text-[10px] hover:bg-main hover:text-app transition-all flex items-center gap-6 group"
                     >
                        Join the Academy
                        <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform" />
                     </button>
                  </div>
               </section>
            </div>

            {/* ARTICLE FOOTER / METADATA */}
            <footer className="pt-24 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-10">
               <div className="flex items-center gap-10">
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 italic">Lattice Registry ID</span>
                     <span className="text-[10px] font-mono font-bold tracking-widest text-accent-blue">LL_P_8859_SYN</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 italic">Revision Status</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-green-500">VERIFIED_STABLE</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  {[Database, Unplug, Microchip, Layers].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 border border-border-main flex items-center justify-center text-dim opacity-20 hover:opacity-100 hover:text-main transition-all cursor-crosshair">
                       <Icon size={16} strokeWidth={1} />
                    </div>
                  ))}
               </div>
            </footer>
         </div>
      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
         <CircuitBackground />
      </div>

    </div>
  );
}
