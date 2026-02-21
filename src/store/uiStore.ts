import { create } from 'zustand';
import { ContextMenuState, ComponentType } from '../types/circuit';

interface UIState {
  contextMenu: ContextMenuState;
  showContextMenu: (x: number, y: number, nodeId?: string, edgeId?: string) => void;
  hideContextMenu: () => void;

  showComponentPalette: boolean;
  showPropertiesPanel: boolean;
  isToolbarVisible: boolean;
  activeSidebarTab: 'library' | 'properties' | 'none';
  
  toggleComponentPalette: () => void;
  togglePropertiesPanel: () => void;
  setToolbarVisible: (visible: boolean) => void;
  setActiveSidebarTab: (tab: 'library' | 'properties' | 'none') => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  setSelectedNodes: (ids: string[]) => void;
  setSelectedEdges: (ids: string[]) => void;
  clearSelection: () => void;

  isDragging: boolean;
  dragType: ComponentType | null;
  setDragging: (isDragging: boolean, type?: ComponentType) => void;

  showICBuilder: boolean;
  showSettings: boolean;
  setShowICBuilder: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;

  // Project Manager modal
  showProjectManager: boolean;
  setShowProjectManager: (show: boolean) => void;

  // Auth modal
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;

  renameDialog: { visible: boolean; nodeId: string; currentLabel: string } | null;
  showRenameDialog: (nodeId: string, currentLabel: string) => void;
  hideRenameDialog: () => void;

  pinInspector: { visible: boolean; nodeId: string } | null;
  showPinInspector: (nodeId: string) => void;
  hidePinInspector: () => void;

  // Grid snap
  snapToGrid: boolean;
  gridSize: number;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;

  // Zoom controls
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Tutorial
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Context menu
  contextMenu: { visible: false, x: 0, y: 0 },
  showContextMenu: (x, y, nodeId, edgeId) =>
    set({ contextMenu: { visible: true, x, y, nodeId, edgeId } }),
  hideContextMenu: () =>
    set({ contextMenu: { visible: false, x: 0, y: 0 } }),

  // Panels & Theme
  showComponentPalette: true,
  showPropertiesPanel: true,
  isToolbarVisible: true,
  activeSidebarTab: 'properties',
  theme: 'dark',
  
  toggleComponentPalette: () =>
    set((s) => ({ showComponentPalette: !s.showComponentPalette })),
  togglePropertiesPanel: () =>
    set((s) => ({ showPropertiesPanel: !s.showPropertiesPanel })),
  setToolbarVisible: (visible) => set({ isToolbarVisible: visible }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),

  // Selection
  selectedNodeIds: [],
  selectedEdgeIds: [],
  setSelectedNodes: (ids) => set({ selectedNodeIds: ids }),
  setSelectedEdges: (ids) => set({ selectedEdgeIds: ids }),
  clearSelection: () => set({ selectedNodeIds: [], selectedEdgeIds: [] }),

  // Drag
  isDragging: false,
  dragType: null,
  setDragging: (isDragging, type) =>
    set({ isDragging, dragType: type ?? null }),

  // Modals
  showICBuilder: false,
  showSettings: false,
  setShowICBuilder: (show) => set({ showICBuilder: show }),
  setShowSettings: (show) => set({ showSettings: show }),

  // Project Manager
  showProjectManager: false,
  setShowProjectManager: (show) => set({ showProjectManager: show }),

  // Auth Modal
  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),

  // Rename dialog
  renameDialog: null,
  showRenameDialog: (nodeId, currentLabel) =>
    set({ renameDialog: { visible: true, nodeId, currentLabel } }),
  hideRenameDialog: () => set({ renameDialog: null }),

  // Pin inspector
  pinInspector: null,
  showPinInspector: (nodeId) =>
    set({ pinInspector: { visible: true, nodeId } }),
  hidePinInspector: () => set({ pinInspector: null }),

  // Grid snap
  snapToGrid: false,
  gridSize: 24,
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setGridSize: (size) => set({ gridSize: size }),

  // Zoom
  zoomLevel: 1.0,
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // Tutorial
  showTutorial: false,
  setShowTutorial: (show) => set({ showTutorial: show }),
}));
