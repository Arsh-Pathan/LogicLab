// ============================================================
// CommunityPage — Browse & publish shared circuits
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Search,
  CircuitBoard,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
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

  // Example circuits when no community data is available
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
      name: 'Multiplexer 4:1',
      description: 'A 4-to-1 multiplexer selecting one of four data inputs based on a 2-bit selector.',
      data: { version: '1.0.0', name: 'Multiplexer 4:1', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-02-10',
    },
    {
      id: 'ex-5',
      project_id: 'ex-5',
      user_id: 'system',
      name: '7-Segment Decoder',
      description: 'A BCD to 7-segment display decoder, converting 4-bit binary inputs to display patterns.',
      data: { version: '1.0.0', name: '7-Segment Decoder', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-02-14',
    },
    {
      id: 'ex-6',
      project_id: 'ex-6',
      user_id: 'system',
      name: 'ALU (4-Bit)',
      description: 'A 4-bit Arithmetic Logic Unit supporting addition, subtraction, AND, OR, and XOR operations.',
      data: { version: '1.0.0', name: 'ALU (4-Bit)', description: '', createdAt: '', updatedAt: '', nodes: [], connections: [], customICs: [] },
      published_at: '2026-02-18',
    },
  ];

  const displayCircuits = filteredCircuits.length > 0 ? filteredCircuits : (searchQuery ? [] : exampleCircuits);

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#02040a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-3 group">
            <Logo size={32} />
            <span className="text-sm font-black uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">LogicLab</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-sm text-white/40 hover:text-white font-bold transition-colors">
              Dashboard
            </button>
            <button onClick={() => navigate('/sandbox')} className="text-sm text-white/40 hover:text-white font-bold transition-colors">
              Sandbox
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-blue-400" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">Community Hub</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Discover Circuits
          </h1>
          <p className="text-white/30 text-sm font-medium max-w-lg">
            Browse circuits shared by the community, learn from others' designs, or publish your own creations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {/* Search */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circuits..."
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-blue-500/50 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
            <span className="text-sm text-white/30 font-medium">Discovering circuits...</span>
          </div>
        ) : displayCircuits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <CircuitBoard size={48} className="text-white/10 mb-6" />
            <h3 className="text-xl font-bold mb-2">No circuits found</h3>
            <p className="text-sm text-white/30">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayCircuits.map((circuit) => (
              <button
                key={circuit.id}
                onClick={() => handleLoadCircuit(circuit)}
                className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group relative overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <CircuitBoard size={20} />
                  </div>
                  <ArrowRight size={16} className="text-white/10 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-2" />
                </div>

                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {circuit.name}
                </h3>
                <p className="text-xs text-white/20 mt-2 line-clamp-2 leading-relaxed min-h-[2.5em]">
                  {circuit.description || 'No description'}
                </p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-white/15">
                    <Clock size={10} />
                    <span className="text-[10px] font-medium">
                      {new Date(circuit.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/15">
                    <Sparkles size={10} />
                    <span className="text-[10px] font-medium">Community</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
