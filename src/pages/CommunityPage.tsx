import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Search,
  Clock,
  ArrowRight,
  Loader2,
  CircuitBoard,
  Database,
  ShieldCheck,
  Share2,
  Terminal,
  Unplug
} from 'lucide-react';
import { gsap } from 'gsap';
import { useCircuitStore } from '../store/circuitStore';
import { useProjectStore } from '../store/projectStore';
import { fetchPublishedCircuits } from '../lib/projectApi';
import { importProject } from '../serialization/importProject';
import Logo from '../components/common/Logo';
import CircuitBackground from '../components/visuals/CircuitBackground';

interface PublishedCircuit {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description: string;
  data: any;
  published_at: string;
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const loadCircuit = useCircuitStore((s: any) => s.loadCircuit);
  const { setProjectName } = useProjectStore();

  const [circuits, setCircuits] = useState<PublishedCircuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPublishedCircuits();
        setCircuits(data);
      } catch (err) {
        console.error('Failed to fetch circuits:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.reveal-item', {
          y: 60,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: 'expo.out'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  const handleLoadCircuit = (circuit: PublishedCircuit) => {
    const result = importProject(JSON.stringify(circuit.data));
    if (result) {
      loadCircuit(result.nodes, result.edges, result.customICs);
      setProjectName(circuit.name);
      navigate('/sandbox');
    }
  };

  const exampleCircuits: PublishedCircuit[] = [
    { id: '1', project_id: '1', user_id: 'scholar_01', name: 'RISC-V Core Pattern', description: 'Deterministic 32-bit execution lattice following IEEE silicon standards.', published_at: '2026-02-15', data: {} },
    { id: '2', project_id: '2', user_id: 'scholar_42', name: '4-Bit Carry-Lookahead', description: 'High-speed addition module with optimized propagation delay verification.', published_at: '2026-02-18', data: {} },
    { id: '3', project_id: '3', user_id: 'scholar_09', name: 'Neuromorphic Synapse', description: 'Experimental logic gate array modeling biological signal integration.', published_at: '2026-02-20', data: {} }
  ];

  const displayCircuits = circuits.length > 0 ? circuits : (searchQuery ? [] : exampleCircuits);

  return (
    <div className="min-h-screen bg-app text-main selection:bg-main selection:text-app" ref={containerRef}>
      
      {/* Navigation Layer */}
      <nav className="border-b border-border-main bg-app/80 backdrop-blur-3xl sticky top-0 z-[100] h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => navigate('/home')}>
            <Logo size={28} className="group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-xl font-black uppercase tracking-tighter">LOGICLAB</span>
          </div>
          <div className="flex gap-10">
             <button onClick={() => navigate('/docs')} className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main">Academy</button>
             <button onClick={() => navigate('/sandbox')} className="text-[10px] font-black uppercase tracking-widest text-main">Terminal</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-32 space-y-32">
        
        {/* Header Protocol */}
        <header className="space-y-12">
           <div className="reveal-item flex items-center gap-6 text-dim opacity-30">
              <Globe size={32} strokeWidth={1} />
              <div className="w-[1px] h-12 bg-main" />
              <Database size={32} strokeWidth={1} />
           </div>
           <div className="space-y-6">
              <h1 className="reveal-item text-8xl md:text-9xl font-black tracking-tightest leading-none uppercase italic">
                 GLOBAL <br /> <span className="text-gradient">REGISTRY.</span>
              </h1>
              <p className="reveal-item text-2xl font-medium text-dim max-w-2xl leading-snug italic opacity-60 uppercase tracking-widest italic">
                 The shared logical lattice of peer-verified architectures. 
                 Explore, audit, and synthesize architectural traces contributed by the academy.
              </p>
           </div>
        </header>

        {/* Global Search Interface */}
        <div className="reveal-item space-y-4 max-w-2xl">
           <span className="text-[9px] font-black uppercase tracking-[0.5em] text-dim opacity-40 italic">Query Registry Trace</span>
           <div className="relative group">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-30 group-focus-within:opacity-100 transition-opacity" />
              <input 
                 type="text" 
                 placeholder="LATTICE_ID..." 
                 className="w-full bg-white/5 border border-border-main rounded-sm py-8 pl-18 pr-6 text-xl lowercase font-bold tracking-tight outline-none focus:border-main transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        {/* Assets Feed */}
        {loading && circuits.length === 0 ? (
           <div className="py-40 flex flex-col items-center gap-8 opacity-20">
              <Loader2 className="animate-spin" size={48} strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-[0.8em]">Syncing Lattice</span>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-border-main border border-border-main shadow-float overflow-hidden">
             {displayCircuits.map((item, i) => (
                <div 
                   key={item.id} 
                   onClick={() => handleLoadCircuit(item)}
                   className="reveal-item bg-app p-12 space-y-12 group hover:bg-neutral-50 transition-colors cursor-crosshair relative"
                >
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-main text-app flex items-center justify-center rounded-sm shadow-premium group-hover:scale-110 transition-transform duration-700">
                         {i % 2 === 0 ? <CircuitBoard size={28} /> : <Terminal size={28} />}
                      </div>
                      <div className="flex items-center gap-3 text-dim opacity-20 group-hover:opacity-100 transition-all">
                         <ShieldCheck size={16} className="text-green-500" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{item.name}</h3>
                      <p className="text-sm font-medium text-dim opacity-60 leading-relaxed uppercase tracking-widest italic group-hover:opacity-100 transition-opacity">
                         {item.description || 'No technical specification provided for this lattice trace.'}
                      </p>
                   </div>

                   <div className="pt-10 border-t border-border-main flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                         <span className="text-[8px] font-black uppercase tracking-widest opacity-30 italic">Revision Log</span>
                         <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-dim">
                            <Clock size={12} />
                            <span>{new Date(item.published_at).toLocaleDateString()}</span>
                         </div>
                      </div>
                      <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-main hover:gap-6 transition-all">
                         Synthesize <ArrowRight size={14} />
                      </button>
                   </div>

                   <div className="absolute left-0 bottom-0 w-2 h-0 bg-main group-hover:h-full transition-all duration-700" />
                </div>
             ))}
           </div>
        )}

        {/* Institutional Outro */}
        <section className="reveal-item py-40 border-t border-border-main text-center space-y-12">
           <div className="flex justify-center gap-6 opacity-20">
              <Share2 size={24} />
              <div className="w-12 h-[1px] bg-main my-auto" />
              <Unplug size={24} />
           </div>
           <h2 className="text-6xl font-black italic tracking-tightest uppercase">Contribute your <br /> architectural trace.</h2>
           <button 
            onClick={() => navigate('/sandbox')}
            className="btn-premium px-16 py-8 text-xs font-black relative group"
           >
              Initialize Contribution Port
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
           </button>
        </section>

      </main>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
         <CircuitBackground />
      </div>
    </div>
  );
}
