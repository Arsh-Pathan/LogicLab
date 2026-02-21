import { create } from 'zustand';

interface ProjectState {
  projectId: string | null;
  projectName: string;
  projectDescription: string;
  isDirty: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // milliseconds

  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setProjectDescription: (description: string) => void;
  setDirty: (dirty: boolean) => void;
  markSaved: () => void;
  setAutoSave: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectId: null,
  projectName: 'Untitled Project',
  projectDescription: '',
  isDirty: false,
  lastSaved: null,
  autoSaveEnabled: true,
  autoSaveInterval: 30000, // 30 seconds

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
    }),
}));
