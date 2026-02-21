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

  // Engine is initialized at store creation time

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-app overflow-hidden transition-theme">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Secondary Action Bar */}
        <div className="h-10 bg-[#060810] border-b border-white/5 flex items-center px-4 gap-2 shrink-0 z-50">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Home size={12} /> Home
          </button>
          <div className="w-px h-4 bg-white/5" />
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <FolderOpen size={12} /> Projects
          </button>
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Globe size={12} /> Community
          </button>
          <div className="w-px h-4 bg-white/5" />
          <button
            onClick={() => setShowProjectManager(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/5 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Save size={12} /> Save / Load
          </button>
          <button
            onClick={() => setShowICBuilder(true)}
            disabled={selectedNodeIds.length === 0}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white/30 hover:text-emerald-400 hover:bg-emerald-400/5 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-20"
          >
            <Package size={12} /> Build IC
          </button>

          <div className="flex-1" />

          {/* Auth status */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03]">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User size={8} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-white/30 max-w-[80px] truncate">{user.email}</span>
              </div>
              <button onClick={signOut} className="p-1 rounded text-white/15 hover:text-white/40 transition-colors">
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <LogIn size={12} /> Sign In
            </button>
          )}
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Canvas */}
          <Canvas />

          {/* Right Properties Panel */}
          {showPropertiesPanel && (
            <aside className="w-80 bg-panel border-l border-muted shrink-0 overflow-y-auto transition-theme">
              <PropertiesPanel />
            </aside>
          )}
        </div>

        {/* Status Bar */}
        <StatusBar />

        {/* Context Menu Overlay */}
        <ContextMenu />

        {/* IC Builder Modal */}
        <ICBuilderModal />

        {/* Project Manager Modal */}
        <ProjectManagerModal />
      </div>
    </ReactFlowProvider>
  );
}
