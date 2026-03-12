import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Clock, ArrowRight, Loader2,
  CircuitBoard, Plus, Trash2,
  FileJson, Users
} from 'lucide-react';
import { useCircuitStore } from '../store/circuitStore';
import { useProjectStore } from '../store/projectStore';
import { fetchPublishedCircuits, fetchUserProjects, deleteProject } from '../lib/projectApi';
import { importProject } from '../serialization/importProject';
import { SavedProject } from '../types/circuit';

export default function CommunityPage() {
  const navigate = useNavigate();
  const loadCircuit = useCircuitStore((s: any) => s.loadCircuit);
  const { setProjectId, setProjectName } = useProjectStore();

  const [circuits, setCircuits] = useState<any[]>([]);
  const [localProjects, setLocalProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-projects' | 'community'>('my-projects');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [remote, local] = await Promise.all([
        fetchPublishedCircuits(),
        fetchUserProjects()
      ]);
      setCircuits(remote);
      setLocalProjects(local);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLoadCircuit = (circuit: any) => {
    const result = importProject(JSON.stringify(circuit.data));
    if (result) {
      loadCircuit(result.nodes, result.edges, result.customICs);
      setProjectId(circuit.id || null);
      setProjectName(circuit.name);
      navigate(`/sandbox/${circuit.id}`);
    }
  };

  const handleDeleteLocal = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const success = await deleteProject(id);
    if (success) {
      setLocalProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const exampleCircuits = [
    { id: 'ex-1', name: 'Half Adder', description: 'A basic half adder circuit demonstrating AND and XOR gates working together.', published_at: new Date().toISOString(), data: {} },
    { id: 'ex-2', name: '4-Bit Counter', description: 'Sequential counter using JK flip-flops with clock signal.',  published_at: new Date().toISOString(), data: {} },
    { id: 'ex-3', name: 'ALU Design', description: 'Arithmetic Logic Unit supporting basic operations.', published_at: new Date().toISOString(), data: {} },
    { id: 'ex-4', name: '7-Segment Decoder', description: 'BCD to 7-segment display decoder with full truth table implementation.', published_at: new Date().toISOString(), data: {} },
    { id: 'ex-5', name: 'SR Latch', description: 'Set-Reset latch built from cross-coupled NOR gates.', published_at: new Date().toISOString(), data: {} },
    { id: 'ex-6', name: 'Multiplexer 4:1', description: 'Four-input multiplexer with two select lines.', published_at: new Date().toISOString(), data: {} },
  ];

  const remoteToDisplay = circuits.length > 0 ? circuits : (searchQuery ? [] : exampleCircuits);
  
  const filteredLocal = localProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRemote = remoteToDisplay.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="section-container py-16">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}
            >
              <Users size={20} />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ color: 'var(--text-main)' }}
            >
              Community
            </h1>
          </div>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-dim)' }}>
            Browse community projects, manage your saved circuits, and discover new designs.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search projects..."
                className="input-field pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 'var(--nav-height)', zIndex: 5 }}>
        <div className="section-container flex gap-8">
          {[
            { key: 'my-projects', label: 'My Projects', count: localProjects.length },
            { key: 'community', label: 'Community Gallery', count: remoteToDisplay.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className="px-2 py-5 text-sm font-semibold relative transition-all hover:opacity-80 active:scale-95"
              style={{
                color: activeTab === tab.key ? 'var(--accent-blue)' : 'var(--text-dim)',
              }}
            >
              <div className="flex items-center gap-2">
                {tab.label}
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: activeTab === tab.key ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                    color: activeTab === tab.key ? 'var(--accent-blue)' : 'var(--text-muted)',
                    border: activeTab === tab.key ? 'none' : '1px solid var(--border-subtle)'
                  }}
                >
                  {tab.count}
                </span>
              </div>
              {activeTab === tab.key && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ backgroundColor: 'var(--accent-blue)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="section-container page-content">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4" style={{ color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={32} />
            <span className="text-sm">Loading projects...</span>
          </div>
        ) : (
          <>
            {/* My Projects */}
            {activeTab === 'my-projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    {filteredLocal.length} project{filteredLocal.length !== 1 ? 's' : ''} saved locally
                  </p>
                  <button
                    onClick={() => navigate('/sandbox')}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <Plus size={16} />
                    New Project
                  </button>
                </div>

                {filteredLocal.length === 0 ? (
                  <div
                    className="card text-center py-16 cursor-pointer"
                    onClick={() => navigate('/sandbox')}
                  >
                    <CircuitBoard
                      size={48}
                      className="mx-auto mb-4"
                      style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                    />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                      No projects yet
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>
                      Create your first circuit in the simulator.
                    </p>
                    <span className="btn-primary" style={{ padding: '10px 24px' }}>
                      Open Simulator
                      <ArrowRight size={16} />
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLocal.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleLoadCircuit(p)}
                        className="card card-interactive p-6 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}
                          >
                            <FileJson size={20} />
                          </div>
                          <button
                            onClick={(e) => handleDeleteLocal(e, p.id)}
                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => {
                              (e.currentTarget.style as any).color = 'var(--accent-red)';
                              (e.currentTarget.style as any).backgroundColor = 'var(--accent-red-light)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget.style as any).color = 'var(--text-muted)';
                              (e.currentTarget.style as any).backgroundColor = 'transparent';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <h3
                          className="text-base font-semibold truncate mb-1"
                          style={{ color: 'var(--text-main)' }}
                        >
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={12} />
                          <span>Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Community Gallery */}
            {activeTab === 'community' && (
              <div>
                <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>
                  {filteredRemote.length} circuit{filteredRemote.length !== 1 ? 's' : ''} shared by the community
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRemote.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadCircuit(item)}
                      className="card card-interactive p-6 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)' }}
                        >
                          <CircuitBoard size={20} />
                        </div>
                        <span className="tag tag-green" style={{ fontSize: '10px', padding: '2px 8px' }}>
                          Community
                        </span>
                      </div>
                      <h3
                        className="text-base font-semibold mb-2"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-sm mb-4 line-clamp-2"
                        style={{ color: 'var(--text-dim)', lineHeight: '1.5' }}
                      >
                        {item.description || 'No description provided.'}
                      </p>
                      <div
                        className="flex items-center justify-between pt-3"
                        style={{ borderTop: '1px solid var(--border-subtle)' }}
                      >
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={12} />
                          <span>{new Date(item.published_at).toLocaleDateString()}</span>
                        </div>
                        <span
                          className="text-xs font-medium flex items-center gap-1"
                          style={{ color: 'var(--accent-blue)' }}
                        >
                          Open <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
