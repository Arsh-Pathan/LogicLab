import { create } from 'zustand';
import { circuitService } from '../lib/services';
import { useCircuitStore } from './circuitStore';
import { exportProject } from '../serialization/exportProject';
import { importProject } from '../serialization/importProject';

interface ProjectState {
  projectId: string | null;
  projectName: string;
  projectDescription: string;
  isDirty: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  isSaving: boolean;
  saveError: string | null;

  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setProjectDescription: (description: string) => void;
  setDirty: (dirty: boolean) => void;
  markSaved: () => void;
  setAutoSave: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  resetProject: () => void;
  save: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: null,
  projectName: 'Untitled Project',
  projectDescription: '',
  isDirty: false,
  lastSaved: null,
  autoSaveEnabled: true,
  autoSaveInterval: 30000,
  isSaving: false,
  saveError: null,

  setProjectId: (id) => set({ projectId: id }),
  setProjectName: (name) => set({ projectName: name, isDirty: true }),
  setProjectDescription: (description) =>
    set({ projectDescription: description, isDirty: true }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  markSaved: () => set({ isDirty: false, lastSaved: new Date() }),
  setAutoSave: (enabled) => set({ autoSaveEnabled: enabled }),
  setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),
  resetProject: () =>
    set({
      projectId: null,
      projectName: 'Untitled Project',
      projectDescription: '',
      isDirty: false,
      lastSaved: null,
      isSaving: false,
      saveError: null,
    }),

  save: async () => {
    const state = get();
    const circuitState = useCircuitStore.getState();

    set({ isSaving: true, saveError: null });
    try {
      const projectData = exportProject(
        circuitState.nodes,
        circuitState.edges,
        circuitState.customICs,
        state.projectName,
        state.projectDescription
      );

      const saved = await circuitService.saveCircuit(projectData, state.projectId);
      if (saved) {
        set({
          projectId: saved.id,
          isSaving: false,
          isDirty: false,
          lastSaved: new Date(),
        });
      } else {
        set({ isSaving: false, saveError: 'Failed to save project' });
      }
    } catch (err: any) {
      set({ isSaving: false, saveError: err.message || 'Save failed' });
    }
  },

  loadProject: async (id) => {
    try {
      const project = await circuitService.getCircuit(id);
      if (!project) return;

      const result = importProject(JSON.stringify(project.data));
      if (result) {
        const circuitStore = useCircuitStore.getState();
        circuitStore.loadCircuit(result.nodes, result.edges, result.customICs);
        set({
          projectId: project.id,
          projectName: project.name,
          projectDescription: project.description,
          isDirty: false,
        });
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  },
}));
