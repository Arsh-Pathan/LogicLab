// ============================================================
// ProjectManagerModal — UI for saving/loading projects
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { X, Save, FolderOpen, Trash2, Calendar, FileJson, Cloud, AlertCircle, Loader2 } from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import { useCircuitStore } from '../../../store/circuitStore';
import { useProjectStore } from '../../../store/projectStore';
import { exportProject } from '../../../serialization/exportProject';
import { importProject } from '../../../serialization/importProject';
import { SavedProject } from '../../../types/circuit';
import { supabaseConfigured } from '../../../lib/supabase';
import { fetchUserProjects, saveProject, deleteProject as deleteProjectApi } from '../../../lib/projectApi';

export default function ProjectManagerModal() {
  const showModal = useUIStore((s) => s.showProjectManager);
  const setShowModal = useUIStore((s) => s.setShowProjectManager);
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const nodes = useCircuitStore((s: any) => s.nodes);
  const edges = useCircuitStore((s: any) => s.edges);
  const customICs = useCircuitStore((s: any) => s.customICs);
  const loadCircuit = useCircuitStore((s: any) => s.loadCircuit);

  const projectName = useProjectStore((s) => s.projectName);
  const setProjectName = useProjectStore((s) => s.setProjectName);
  const currentProjectId = useProjectStore((s) => s.projectId);
  const setProjectId = useProjectStore((s) => s.setProjectId);

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'load' | 'save'>('load');
  const [saveName, setSaveName] = useState(projectName);
  const [saveDesc, setSaveDesc] = useState('');

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchUserProjects(user.id);
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (showModal && isAuthenticated && user) {
      fetchProjects();
    }
  }, [showModal, isAuthenticated, user, fetchProjects]);

  const handleSave = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    const projectData = exportProject(nodes, edges, customICs, saveName, saveDesc);

    try {
      const saved = await saveProject(user.id, projectData, currentProjectId);

      if (saved) {
        setProjectId(saved.id);
        setProjectName(saved.name);
        await fetchProjects();
        setShowModal(false);
      } else {
        setError('Failed to save project');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  }, [user, saveName, saveDesc, nodes, edges, customICs, currentProjectId, setProjectId, setProjectName, fetchProjects, setShowModal, setShowAuthModal]);

  const handleLoad = useCallback((project: SavedProject) => {
    const result = importProject(JSON.stringify(project.data));
    if (result) {
      loadCircuit(result.nodes, result.edges, result.customICs);
      setProjectId(project.id);
      setProjectName(project.name);
      setShowModal(false);
    }
  }, [loadCircuit, setProjectId, setProjectName, setShowModal]);

  const handleDelete = useCallback(async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user || !window.confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const success = await deleteProjectApi(id, user.id);
      if (success) {
        if (currentProjectId === id) {
          setProjectId(null);
        }
        await fetchProjects();
      }
    } catch (err) {
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  }, [user, currentProjectId, setProjectId, fetchProjects]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-200">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex gap-4">
            <button 
              onClick={() => setView('load')}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${view === 'load' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              Open Project
            </button>
            <button 
              onClick={() => setView('save')}
              className={`text-lg font-bold pb-1 border-b-2 transition-colors ${view === 'save' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              Save Project
            </button>
          </div>
          <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-lg text-xs mb-4 flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {!supabaseConfigured ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <AlertCircle size={48} className="text-yellow-500/50" />
              <div>
                <h3 className="text-white font-medium">Cloud Saving Unavailable</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-2">
                  Supabase is not configured. You can still use the <b>Export</b> button in the toolbar to save projects to your computer as <code>.logic</code> files.
                </p>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <Cloud size={48} className="text-blue-500/30" />
              <div>
                <h3 className="text-white font-medium">Sign in to sync projects</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-2">
                  Keep your logic designs backed up in the cloud and access them from any device.
                </p>
              </div>
              <button 
                onClick={() => { setShowModal(false); setShowAuthModal(true); }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : view === 'load' ? (
            <div className="space-y-3">
              {loading && projects.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="text-blue-500 animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FolderOpen size={40} className="mx-auto mb-3 opacity-20" />
                  <p>You haven't saved any projects yet.</p>
                </div>
              ) : (
                projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleLoad(p)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      currentProjectId === p.id 
                        ? 'bg-blue-900/10 border-blue-500 shadow-lg shadow-blue-500/5' 
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                    } group`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${currentProjectId === p.id ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                          <FileJson size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 italic">{p.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Calendar size={10} />
                            {new Date(p.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, p.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Project Name</label>
                    <input 
                      type="text" 
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description (Optional)</label>
                    <textarea 
                      value={saveDesc}
                      onChange={(e) => setSaveDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-emerald-900/10 border border-emerald-800/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-emerald-400">
                  {currentProjectId ? 'This will overwrite your current cloud save.' : 'Your design will be saved to your private cloud storage.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => setShowModal(false)}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          {view === 'save' && isAuthenticated && (
            <button 
              onClick={handleSave}
              disabled={loading || !saveName.trim()}
              className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm font-bold disabled:opacity-40 shadow-lg shadow-blue-600/20"
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
