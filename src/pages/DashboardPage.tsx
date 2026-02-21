import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FolderOpen,
  Trash2,
  Clock,
  Search,
  Upload,
  LogOut,
  ArrowRight,
  FileJson,
  Loader2,
  Database,
  Terminal
} from 'lucide-react';
import { gsap } from 'gsap';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useCircuitStore } from '../store/circuitStore';
import { SavedProject } from '../types/circuit';
import { fetchUserProjects, deleteProject } from '../lib/projectApi';
import { importProject } from '../serialization/importProject';
import Logo from '../components/common/Logo';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { setProjectId, setProjectName } = useProjectStore();
  const loadCircuit = useCircuitStore((s: any) => s.loadCircuit);

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchUserProjects(user.id);
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchProjects]);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.reveal-item', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  const handleLoadProject = (project: SavedProject) => {
    const result = importProject(JSON.stringify(project.data));
    if (result) {
      loadCircuit(result.nodes, result.edges, result.customICs);
      setProjectId(project.id);
      setProjectName(project.name);
      navigate('/sandbox');
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user || !window.confirm('Erase this data permanently from the logic lattice?')) return;

    try {
      const success = await deleteProject(id, user.id);
      if (success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.logic,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = importProject(ev.target?.result as string);
        if (result) {
          loadCircuit(result.nodes, result.edges, result.customICs);
          setProjectName(result.projectName);
          navigate('/sandbox');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-app transition-colors duration-500 pb-32" ref={containerRef}>
      {/* Precision Navigation */}
      <nav className="border-b border-border-main bg-app/80 backdrop-blur-2xl sticky top-0 z-50 h-20 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-4 group">
            <Logo size={36} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 group-hover:text-main transition-colors">Infrastructure</span>
          </button>
          
          <div className="flex items-center gap-6">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 px-6 py-2 border border-border-main rounded-sm bg-neutral-50 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-main truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-3 rounded-sm text-dim hover:text-red-500 hover:bg-neutral-100 transition-all font-black"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/home')}
                className="px-8 py-3 bg-main text-app text-[10px] font-black uppercase tracking-widest hover:invert transition-all"
              >
                Sync Terminal
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="reveal-item flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <Database size={24} className="text-main" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-dim opacity-40">System Projects</span>
            </div>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">The Registry</h1>
            <p className="text-2xl text-dim font-medium max-w-2xl leading-none tracking-tighter uppercase italic opacity-30">
              {projects.length} verified logical architectures stored.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleImportFile}
              className="flex items-center gap-4 px-10 py-4 border border-border-main text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all"
            >
              <Upload size={14} /> Import Protocol
            </button>
            <button
              onClick={() => navigate('/sandbox')}
              className="flex items-center gap-4 px-10 py-4 bg-main text-app text-[10px] font-black uppercase tracking-widest hover:invert transition-all shadow-premium"
            >
              <Plus size={14} /> New Instance
            </button>
          </div>
        </div>

        {/* Search Matrix */}
        <div className="reveal-item relative mb-20 max-w-xl">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query persistent data..."
            className="premium-input pl-16 py-8"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={40} className="text-main animate-spin mb-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dim opacity-40 italic">Retrieving Logic States</span>
          </div>
        ) : !isAuthenticated ? (
          <div className="reveal-item flex flex-col items-center justify-center py-32 text-center border-2 border-border-main border-dashed opacity-50">
            <Terminal size={60} className="text-dim mb-8" />
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Authentication Required</h3>
            <p className="text-lg text-dim font-medium mb-12 max-w-md italic tracking-tight">
              Sign in to anchor your circuits to the cloud lattice and enable cross-institutional sync.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-12 py-5 bg-main text-app text-[10px] font-black uppercase tracking-[0.2em] hover:invert transition-all"
            >
              Initialize Handshake
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="reveal-item flex flex-col items-center justify-center py-40 text-center opacity-40 group cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigate('/sandbox')}>
            <FolderOpen size={72} className="text-main mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-4">Registry Empty</h3>
            <p className="text-xl text-dim font-medium italic">Begin a design in the sandbox to persist data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 border-t border-border-main">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleLoadProject(project)}
                className="reveal-item group flex items-center justify-between p-12 bg-app hover:bg-neutral-50 border-b border-border-main transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-12 relative z-10 w-full">
                  <div className="w-16 h-16 bg-main text-app flex items-center justify-center rounded-sm transition-all duration-700 shadow-premium group-hover:rotate-12">
                    <FileJson size={28} />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-4xl font-black uppercase tracking-tighter group-hover:translate-x-2 transition-transform leading-none">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-dim opacity-40 italic">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>Modified {new Date(project.updated_at).toLocaleDateString()}</span>
                      </div>
                      <span className="hidden md:inline">UID: {project.id.slice(0, 8)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="p-4 rounded-sm text-dim hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                    <ArrowRight size={24} className="text-dim opacity-10 group-hover:opacity-100 group-hover:translate-x-3 transition-all" />
                  </div>
                </div>
                <div className="absolute left-0 top-0 w-1.5 h-full bg-main scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
