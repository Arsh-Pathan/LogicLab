import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Clock,
  Search,
  Upload,
  ArrowRight,
  FileJson,
  Loader2,
  Database,
  Terminal,
  Activity,
  Binary,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { gsap } from 'gsap';
import { useProjectStore } from '../store/projectStore';
import { useCircuitStore } from '../store/circuitStore';
import { SavedProject } from '../types/circuit';
import { fetchUserProjects, deleteProject } from '../lib/projectApi';
import { importProject } from '../serialization/importProject';
import Logo from '../components/common/Logo';
import CircuitBackground from '../components/visuals/CircuitBackground';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { setProjectId, setProjectName } = useProjectStore();
  const loadCircuit = useCircuitStore((s: any) => s.loadCircuit);

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUserProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

  const handleLoadProject = (project: SavedProject) => {
    const result = importProject(JSON.stringify(project.data));
    if (result) {
      loadCircuit(result.nodes, result.edges, result.customICs);
      setProjectId(project.id);
      setProjectName(project.name);
      navigate(`/sandbox/${project.id}`);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Erase this architecture from the persistent lattice?')) return;

    try {
      const success = await deleteProject(id);
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
    <div ref={containerRef} className="min-h-screen bg-app text-main selection:bg-main selection:text-app relative overflow-x-hidden">
      
      {/* Background Decor Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
         <CircuitBackground />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 border-b border-border-main bg-app/80 backdrop-blur-3xl px-8 flex items-center justify-between">
         <div className="flex items-center gap-6 cursor-pointer group" onClick={() => navigate('/home')}>
            <Logo size={28} className="group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-xl font-black uppercase tracking-tighter">LOGICLAB</span>
         </div>
         <div className="flex items-center gap-8">
            <button onClick={() => navigate('/community')} className="text-[10px] font-black uppercase tracking-widest text-dim hover:text-main transition-colors">Registry</button>
            <button onClick={() => navigate('/sandbox')} className="btn-premium px-8 py-3">Initialization Terminal</button>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-48 space-y-32 relative z-10">
         
         {/* Registry Header */}
         <header className="space-y-12">
            <div className="reveal-item flex items-center gap-6 text-dim opacity-30">
               <Database size={32} strokeWidth={1} />
               <div className="w-[1px] h-12 bg-main" />
               <Activity size={32} strokeWidth={1} />
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
               <div className="space-y-6">
                  <h1 className="reveal-item text-8xl md:text-9xl font-black tracking-tightest leading-none uppercase italic">
                     THE <br /> <span className="text-gradient">REGISTRY.</span>
                  </h1>
                  <p className="reveal-item text-xl font-bold text-dim opacity-40 uppercase tracking-[0.5em] italic leading-none">
                     {projects.length} Verified Architectural Traces Found.
                  </p>
               </div>
               <div className="reveal-item flex gap-6">
                  <button onClick={handleImportFile} className="btn-outline-premium px-10 py-6 group flex items-center gap-3">
                     <Upload size={16} className="group-hover:-translate-y-1 transition-transform" />
                     Import Trace
                  </button>
                  <button onClick={() => navigate('/sandbox')} className="btn-premium px-10 py-6 group flex items-center gap-3">
                     <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                     New Architecture
                  </button>
               </div>
            </div>
         </header>

         {/* Search Filter Port */}
         <div className="reveal-item space-y-4 max-w-2xl">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-dim opacity-40 italic">Query Persistent Data</span>
            <div className="relative group">
               <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-30 group-focus-within:opacity-100 transition-opacity" />
               <input 
                  type="text" 
                  placeholder="LATTICE_QUERY..." 
                  className="w-full bg-white/5 border border-border-main rounded-sm py-8 pl-18 pr-6 text-xl lowercase font-bold tracking-tight outline-none focus:border-main transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* Registry Lattices Feed */}
         {loading ? (
            <div className="py-40 flex flex-col items-center gap-8 opacity-20">
               <Loader2 className="animate-spin" size={48} strokeWidth={1} />
               <span className="text-[10px] font-black uppercase tracking-[0.8em]">Syncing Lattice</span>
            </div>
         ) : filteredProjects.length === 0 ? (
            <div className="reveal-item py-48 border-2 border-dashed border-border-main flex flex-col items-center justify-center gap-12 opacity-30 group cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigate('/sandbox')}>
               <Layers size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-700" />
               <div className="text-center space-y-4">
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase">Registry Empty</h3>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] italic">No architectural traces detected in this sector.</p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 border-t border-border-main">
               {filteredProjects.map((project) => (
                  <div 
                     key={project.id}
                     onClick={() => handleLoadProject(project)}
                     className="reveal-item p-12 border-b border-border-main flex flex-col md:flex-row items-center justify-between gap-12 group hover:bg-neutral-50 transition-all cursor-pointer relative overflow-hidden"
                  >
                     <div className="flex items-center gap-12 relative z-10 w-full">
                        <div className="w-20 h-20 bg-main text-app flex items-center justify-center rounded-sm shadow-premium group-hover:invert transition-all duration-700">
                           <FileJson size={32} />
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-4">
                              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none group-hover:translate-x-2 transition-transform">
                                 {project.name}
                              </h3>
                              <ShieldCheck size={16} className="text-green-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <div className="flex flex-wrap items-center gap-10 text-[9px] font-black uppercase tracking-widest text-dim opacity-40 italic">
                              <div className="flex items-center gap-3">
                                 <Clock size={12} />
                                 <span>Last Sync {new Date(project.updated_at).toLocaleDateString()}</span>
                              </div>
                              <span className="hidden sm:block">LATTICE_ID: {project.id.slice(0, 12)}</span>
                              <div className="flex items-center gap-3">
                                 <Binary size={12} />
                                 <span>Verified Stable</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-10">
                           <button 
                              onClick={(e) => handleDeleteProject(e, project.id)}
                              className="w-12 h-12 border border-border-main flex items-center justify-center text-dim hover:text-red-500 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100"
                           >
                              <Trash2 size={18} />
                           </button>
                           <ArrowRight size={24} className="text-dim opacity-10 group-hover:opacity-100 group-hover:translate-x-4 transition-all" />
                        </div>
                     </div>
                     {/* Hover Interaction Bar */}
                     <div className="absolute left-0 bottom-0 w-2 h-0 bg-main group-hover:h-full transition-all duration-700" />
                  </div>
               ))}
            </div>
         )}

         {/* Technical Outro */}
         <footer className="reveal-item pt-40 border-t border-border-main text-center space-y-12">
            <div className="flex justify-center gap-8 opacity-20">
               <Terminal size={24} />
               <div className="w-12 h-[1px] bg-main my-auto" />
               <Binary size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-dim opacity-30 italic">
               All architectures persist in this terminal's local lattice.
            </p>
         </footer>

      </main>

    </div>
  );
}
