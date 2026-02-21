import { ReactFlowProvider } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { Save, FolderOpen, Home, LogIn, User, LogOut, Globe, Package } from 'lucide-react';

import Canvas from '../features/workspace/components/Canvas';
import Toolbar from '../features/workspace/components/Toolbar';
import StatusBar from '../features/workspace/components/StatusBar';
import ContextMenu from '../features/workspace/components/ContextMenu';
import ICBuilderModal from '../features/workspace/components/ICBuilderModal';
import PropertiesPanel from '../features/workspace/components/PropertiesPanel';
import ProjectManagerModal from '../features/projects/components/ProjectManagerModal';
import TutorialOverlay from '../components/common/TutorialOverlay';
import { useEffect } from 'react';

import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export default function WorkspacePage() {
  const navigate = useNavigate();
  const showPropertiesPanel = useUIStore((s: any) => s.showPropertiesPanel);
  const setShowICBuilder = useUIStore((s: any) => s.setShowICBuilder);
  const setShowProjectManager = useUIStore((s) => s.setShowProjectManager);
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);

  const { isAuthenticated, user, signOut } = useAuthStore();
  const selectedNodeIds = useUIStore((s: any) => s.selectedNodeIds);
  const setShowTutorial = useUIStore((s) => s.setShowTutorial);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('logiclab_tutorial_completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [setShowTutorial]);

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

          <div className="flex-1" />

          {/* Institutional Status */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-1.5 border border-border-main rounded-sm bg-neutral-50 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-main truncate max-w-[120px]">{user.email}</span>
              </div>
              <button 
                onClick={signOut} 
                className="p-2 rounded-sm text-dim hover:text-main hover:bg-red-50 transition-all"
                title="Institutional Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-main text-app rounded-sm hover:invert transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <LogIn size={12} /> Laboratory Access
            </button>
          )}
        </div>

        {/* Main Research Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Simulation Canvas */}
          <Canvas />

          {/* System Properties Panel */}
          {showPropertiesPanel && (
            <aside className="w-80 bg-panel border-l border-border-main shrink-0 overflow-y-auto shadow-premium z-10">
              <PropertiesPanel />
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

