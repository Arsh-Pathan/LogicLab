// ============================================================
// ProjectManagerModal — Save / Load projects via localStorage
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { X, Save, FolderOpen, Trash2, Calendar, FileJson, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { useCircuitStore } from '../../../store/circuitStore';
import { useProjectStore } from '../../../store/projectStore';
import { exportProject } from '../../../serialization/exportProject';
import { importProject } from '../../../serialization/importProject';
import { SavedProject } from '../../../types/circuit';
import { fetchUserProjects, saveProject, deleteProject as deleteProjectApi } from '../../../lib/projectApi';

export default function ProjectManagerModal() {
  const showModal = useUIStore((s) => s.showProjectManager);
  const setShowModal = useUIStore((s) => s.setShowProjectManager);

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
    setLoading(true);
    try {
      const data = await fetchUserProjects();
      setProjects(data);
    } catch {
      setError('Failed to load projects from local storage');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      setSaveName(projectName);
      fetchProjects();
    }
  }, [showModal, projectName, fetchProjects]);

  const handleSave = useCallback(async () => {
    if (!saveName.trim()) return;

    setLoading(true);
    setError(null);

    const projectData = exportProject(nodes, edges, customICs, saveName, saveDesc);

    try {
      const saved = await saveProject('anonymous', projectData, currentProjectId);
      if (saved) {
        setProjectId(saved.id);
        setProjectName(saved.name);
        await fetchProjects();
        setView('load');
      } else {
        setError('Failed to save project');
      }
    } catch {
      setError('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  }, [saveName, saveDesc, nodes, edges, customICs, currentProjectId, setProjectId, setProjectName, fetchProjects]);

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
    if (!window.confirm('Erase this architectural trace from the local lattice?')) return;

    setLoading(true);
    try {
      const success = await deleteProjectApi(id);
      if (success) {
        if (currentProjectId === id) {
          setProjectId(null);
        }
        await fetchProjects();
      }
    } catch {
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  }, [currentProjectId, setProjectId, fetchProjects]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-app border border-border-main rounded-sm shadow-float w-full max-w-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="px-8 py-5 border-b border-border-main flex items-center justify-between shrink-0">
          <div className="flex gap-6">
            <button
              onClick={() => setView('load')}
              className={`text-[11px] font-black uppercase tracking-widest pb-2 border-b-2 transition-colors ${view === 'load' ? 'text-main border-main' : 'text-dim border-transparent hover:text-main'}`}
            >
              Open Project
            </button>
            <button
              onClick={() => { setView('save'); setSaveName(projectName); }}
              className={`text-[11px] font-black uppercase tracking-widest pb-2 border-b-2 transition-colors ${view === 'save' ? 'text-main border-main' : 'text-dim border-transparent hover:text-main'}`}
            >
              Save Project
            </button>
          </div>
          <button onClick={() => setShowModal(false)} className="text-dim hover:text-main transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 min-h-[360px] space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-sm text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {view === 'load' ? (
            <div className="space-y-2">
              {loading && projects.length === 0 ? (
                <div className="flex justify-center py-16">
                  <Loader2 size={32} className="text-main animate-spin opacity-30" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-16 space-y-4 opacity-30">
                  <FolderOpen size={40} className="mx-auto" strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-widest">No saved projects found</p>
                  <button
                    onClick={() => setView('save')}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-main mx-auto hover:gap-3 transition-all"
                  >
                    <Plus size={12} /> Start Saving
                  </button>
                </div>
              ) : (
                projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleLoad(p)}
                    className={`w-full text-left p-5 border transition-all group rounded-sm ${
                      currentProjectId === p.id
                        ? 'bg-main/5 border-main shadow-premium'
                        : 'bg-transparent border-border-main hover:border-main hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-sm ${currentProjectId === p.id ? 'bg-main text-app' : 'bg-neutral-100 text-dim'}`}>
                          <FileJson size={16} />
                        </div>
                        <div>
                          <h4 className="font-black text-main text-sm uppercase tracking-tight">{p.name}</h4>
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-dim opacity-50 mt-1">
                            <Calendar size={10} />
                            <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                            {p.description && <span className="italic">· {p.description}</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, p.id)}
                        className="p-2 text-dim hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black text-dim uppercase tracking-[0.5em] mb-3">Project Name</label>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="e.g., 4-Bit Adder"
                    className="w-full bg-transparent border border-border-main rounded-sm px-5 py-4 text-main text-sm font-bold focus:border-main outline-none transition-all placeholder:text-dim placeholder:opacity-30"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-dim uppercase tracking-[0.5em] mb-3">Description (Optional)</label>
                  <textarea
                    value={saveDesc}
                    onChange={(e) => setSaveDesc(e.target.value)}
                    rows={3}
                    placeholder="Brief architectural description..."
                    className="w-full bg-transparent border border-border-main rounded-sm px-5 py-4 text-main text-sm font-bold focus:border-main outline-none transition-all resize-none placeholder:text-dim placeholder:opacity-30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border border-border-main rounded-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                <p className="text-[9px] font-black uppercase tracking-widest text-dim opacity-60 italic">
                  {currentProjectId ? 'Will overwrite current local save.' : 'New project will be created in local storage.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border-main flex justify-end gap-4 shrink-0">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-dim hover:text-main transition-colors"
          >
            Close
          </button>
          {view === 'save' && (
            <button
              onClick={handleSave}
              disabled={loading || !saveName.trim()}
              className="flex items-center gap-2 px-10 py-3 bg-main text-app text-[10px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 disabled:opacity-30 transition-all shadow-premium"
            >
              <Save size={14} /> {loading ? 'Saving...' : 'Save Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
