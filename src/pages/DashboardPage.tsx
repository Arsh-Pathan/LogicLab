// ============================================================
// DashboardPage — User's project management hub
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FolderOpen,
  Trash2,
  Clock,
  CircuitBoard,
  Search,
  Upload,
  LogOut,
  User,
  ArrowRight,
  FileJson,
  Loader2,
} from 'lucide-react';
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
    if (!user || !window.confirm('Delete this project permanently?')) return;

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
    <div className="min-h-screen bg-[#02040a] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#02040a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-3 group">
            <Logo size={32} />
            <span className="text-sm font-black uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">LogicLab</span>
          </button>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <span className="text-xs font-bold text-white/70 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/home')}
                className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Your Projects</h1>
            <p className="text-white/30 text-sm font-medium mt-2">
              {projects.length} project{projects.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImportFile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all text-sm font-bold"
            >
              <Upload size={16} />
              Import File
            </button>
            <button
              onClick={() => navigate('/sandbox')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all text-sm font-bold shadow-lg shadow-blue-600/20"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full md:w-80 h-11 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-blue-500/50 outline-none transition-all font-medium"
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
            <span className="text-sm text-white/30 font-medium">Loading projects...</span>
          </div>
        ) : !isAuthenticated ? (
          /* Not signed in */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <CircuitBoard size={36} className="text-white/20" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sign in to manage projects</h3>
            <p className="text-sm text-white/30 max-w-sm mb-8">
              Create an account or sign in to save your circuits to the cloud and access them from anywhere.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleImportFile}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
              >
                Import Local File
              </button>
              <button
                onClick={() => navigate('/sandbox')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-bold hover:bg-blue-500 transition-all"
              >
                Start Sandbox
              </button>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* No projects */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <FolderOpen size={36} className="text-white/20" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? 'No matching projects' : 'No projects yet'}
            </h3>
            <p className="text-sm text-white/30 max-w-sm mb-8">
              {searchQuery
                ? 'Try a different search term.'
                : 'Start a new project in the sandbox and save it here.'}
            </p>
            <button
              onClick={() => navigate('/sandbox')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-bold hover:bg-blue-500 transition-all"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleLoadProject(project)}
                className="text-left p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <FileJson size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="p-1.5 rounded-lg text-white/10 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ArrowRight size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
                  </div>
                </div>

                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm truncate">
                  {project.name}
                </h3>
                <p className="text-xs text-white/20 mt-1 line-clamp-2">
                  {project.description || 'No description'}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-white/15">
                  <Clock size={10} />
                  <span className="text-[10px] font-medium">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
