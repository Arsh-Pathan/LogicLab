import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Search,
  CircuitBoard,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  CircuitBoard as CircuitIcon,
  Code2
} from 'lucide-react';
import { gsap } from 'gsap';
import { useCircuitStore } from '../store/circuitStore';
import { useProjectStore } from '../store/projectStore';
import { fetchPublishedCircuits } from '../lib/projectApi';
import { importProject } from '../serialization/importProject';
import Logo from '../components/common/Logo';

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
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out'
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

  const filteredCircuits = circuits.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exampleCircuits: PublishedCircuit[] = [
    {
      id: 'ex-1',
      project_id: 'ex-1',
      user_id: 'system',
      name: 'Half Adder',
      description: 'A basic half adder circuit using XOR and AND gates to compute sum and carry of two single-bit inputs.',
      data: { version: '1.0.0', name: 'Half Adder', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-01-15',
    },
    {
      id: 'ex-2',
      project_id: 'ex-2',
      user_id: 'system',
      name: 'SR Latch',
      description: 'A basic Set-Reset latch built with NOR gates, demonstrating sequential logic and memory.',
      data: { version: '1.0.0', name: 'SR Latch', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-01-20',
    },
    {
      id: 'ex-3',
      project_id: 'ex-3',
      user_id: 'system',
      name: '4-Bit Counter',
      description: 'A synchronous 4-bit binary counter using clock-driven JK flip-flops chained together.',
      data: { version: '1.0.0', name: '4-Bit Counter', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-02-01',
    },
    {
      id: 'ex-4',
      project_id: 'ex-4',
      user_id: 'system',
      name: 'ALU (4-Bit)',
      description: 'A 4-bit Arithmetic Logic Unit supporting addition, subtraction, AND, OR, and XOR operations.',
      data: { version: '1.0.0', name: 'ALU (4-Bit)', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-02-18',
    }
  ];

  const displayCircuits = filteredCircuits.length > 0 ? filteredCircuits : (searchQuery ? [] : exampleCircuits);

  return (
    <div className="min-h-screen bg-app transition-colors duration-500 pb-32" ref={containerRef}>
      {/* Precision Navigation */}
      <nav className="border-b border-border-main bg-app/80 backdrop-blur-2xl sticky top-0 z-50 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-4 group">
            <Logo size={36} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-main transition-colors opacity-50">Infrastructure</span>
          </button>
          
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main transition-colors">
              Registry
            </button>
            <button onClick={() => navigate('/sandbox')} className="px-6 py-2 border border-border-main text-[10px] font-black uppercase tracking-widest hover:bg-main hover:text-app transition-all">
              Initialize Lab
            </button>
          </div>
        </div>
      </nav>

      {/* High-Prestige Hero */}
      <div className="pt-32 pb-20 border-b border-border-main relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="reveal-item flex items-center gap-4 mb-8">
            <Globe size={24} className="text-main" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-dim opacity-50">Global Laboratory Sync</span>
          </div>
          <h1 className="reveal-item text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
            Circuit <br />Archaeology
          </h1>
          <p className="reveal-item text-2xl text-dim font-medium max-w-2xl leading-snug tracking-tight">
            Explore the peer-verified library of digital systems. <br />
            <span className="text-main italic font-bold">Standardized logic for a modular future.</span>
          </p>
        </div>
        <div className="absolute right-0 top-0 text-[400px] font-black italic text-main opacity-[0.015] translate-x-1/4 -translate-y-1/4 pointer-events-none select-none">
          HUB
        </div>
      </div>

      {/* Search & Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="reveal-item flex items-center gap-6 mb-16 max-w-2xl">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query the logic lattice..."
              className="premium-input pl-16 py-8"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={40} className="text-main animate-spin mb-6 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dim opacity-50">Syncing Peer Data</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-border-main border border-border-main shadow-premium">
            {displayCircuits.map((circuit) => (
              <div
                key={circuit.id}
                onClick={() => handleLoadCircuit(circuit)}
                className="reveal-item text-left p-12 bg-app hover:bg-neutral-50 transition-all group relative cursor-pointer"
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="w-14 h-14 bg-main text-app flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform shadow-premium">
                    <CircuitIcon size={24} />
                  </div>
                  <Sparkles size={16} className="text-dim opacity-20 group-hover:opacity-100 group-hover:text-main transition-all" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform">
                    {circuit.name}
                  </h3>
                  <p className="text-sm text-dim font-medium leading-relaxed line-clamp-2 opacity-60 italic group-hover:opacity-100 transition-opacity">
                    {circuit.description || 'No technical specification provided.'}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-border-main flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-dim opacity-40">
                    <Clock size={12} />
                    <span>Published {new Date(circuit.published_at).toLocaleDateString()}</span>
                  </div>
                  <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-6 transition-all">
                    Sync <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
