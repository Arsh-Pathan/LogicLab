import { ReactFlowProvider } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { Save, FolderOpen, Home, Globe, Package } from 'lucide-react';

import Canvas from '../features/workspace/components/Canvas';
import Toolbar from '../features/workspace/components/Toolbar';
import StatusBar from '../features/workspace/components/StatusBar';
import ContextMenu from '../features/workspace/components/ContextMenu';
import ICBuilderModal from '../features/workspace/components/ICBuilderModal';
import PropertiesPanel from '../features/workspace/components/PropertiesPanel';
import ICLibraryPanel from '../features/workspace/components/ICLibraryPanel';
import ProjectManagerModal from '../features/projects/components/ProjectManagerModal';
import TutorialOverlay from '../components/common/TutorialOverlay';
import { useEffect, useCallback, useRef } from 'react';

import { useUIStore } from '../store/uiStore';

export default function WorkspacePage() {
  const navigate = useNavigate();
  const showPropertiesPanel = useUIStore((s: any) => s.showPropertiesPanel);
  const propertiesPanelWidth = useUIStore((s: any) => s.propertiesPanelWidth);
  const setPropertiesPanelWidth = useUIStore((s: any) => s.setPropertiesPanelWidth);
  const setShowICBuilder = useUIStore((s: any) => s.setShowICBuilder);
  const setShowProjectManager = useUIStore((s) => s.setShowProjectManager);
  const selectedNodeIds = useUIStore((s: any) => s.selectedNodeIds);
  const setShowTutorial = useUIStore((s) => s.setShowTutorial);
  const showComponentPalette = useUIStore((s: any) => s.showComponentPalette);
  const toggleComponentPalette = useUIStore((s: any) => s.toggleComponentPalette);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('logiclab_tutorial_completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [setShowTutorial]);

  const isResizing = useRef(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = (mouseEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = document.body.clientWidth - mouseEvent.clientX;
      setPropertiesPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [setPropertiesPanelWidth]);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-app overflow-hidden selection:bg-main selection:text-app">
        {/* Unified System Toolbar */}
        <Toolbar />

        {/* Action Infrastructure Bar */}
        <div className="h-12 bg-app border-b border-border-main flex items-center px-6 gap-3 shrink-0 z-50">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-dim hover:text-main hover:bg-neutral-100 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Home size={12} /> Home
          </button>
          <div className="w-[1px] h-4 bg-border-main" />
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-dim hover:text-main hover:bg-neutral-100 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <FolderOpen size={12} /> Projects
          </button>
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-dim hover:text-main hover:bg-neutral-100 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Globe size={12} /> Community
          </button>
          <div className="w-[1px] h-4 bg-border-main" />
          <button
            onClick={() => setShowProjectManager(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-dim hover:text-main hover:bg-neutral-100 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Save size={12} /> Save Hub
          </button>
          <button
            onClick={() => setShowICBuilder(true)}
            disabled={selectedNodeIds.length === 0}
            className="flex items-center gap-2 px-4 py-1.5 rounded-sm text-dim hover:text-main hover:bg-neutral-100 transition-all text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-20"
          >
            <Package size={12} /> Package IC
          </button>
          <button
            onClick={toggleComponentPalette}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm transition-all text-[10px] font-black uppercase tracking-[0.2em] ${
              showComponentPalette 
                ? 'bg-main text-app shadow-sm' 
                : 'text-dim hover:text-main hover:bg-neutral-100'
            }`}
          >
            <Package size={12} className={showComponentPalette ? 'text-blue-400' : ''} /> IC Library
          </button>

          <div className="flex-1" />

          {/* Institutional Status (Anonymous Mode) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1.5 border border-border-main rounded-sm bg-neutral-50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-main truncate">Anonymous Protocol</span>
            </div>
          </div>
        </div>

        {/* Main Research Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* IC Library Panel */}
          <ICLibraryPanel />

          {/* Simulation Canvas */}
          <Canvas />

          {/* System Properties Panel */}
          {showPropertiesPanel && (
            <aside 
              className="bg-panel border-l border-border-main shrink-0 relative flex shadow-premium z-10"
              style={{ width: `${propertiesPanelWidth}px` }}
            >
              {/* Resizable drag handle */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 -translate-x-1/2 cursor-col-resize hover:bg-accent-blue/50 z-50 transition-colors"
                onMouseDown={startResizing}
              />
              <div className="flex-1 min-w-0 overflow-y-auto">
                <PropertiesPanel />
              </div>
            </aside>
          )}
        </div>

        {/* Precision Status Bar */}
        <StatusBar />

        {/* Context Menu Overlay */}
        <ContextMenu />

        {/* IC Assembly Modal */}
        <ICBuilderModal />

        {/* Project Registry Modal */}
        <ProjectManagerModal />

        {/* System Onboarding */}
        <TutorialOverlay />
      </div>
    </ReactFlowProvider>
  );
}

