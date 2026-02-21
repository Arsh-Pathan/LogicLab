import { useCallback, DragEvent } from 'react';
import {
  Download,
  Trash2,
  Zap,
  Settings,
  Circle,
  Clock,
  Sun,
  Moon,
  ToggleLeft
} from 'lucide-react';
import { useCircuitStore } from '../../../store/circuitStore';
import { useUIStore } from '../../../store/uiStore';
import { useProjectStore } from '../../../store/projectStore';
import { exportProject } from '../../../serialization/exportProject';
import { ComponentType } from '../../../types/circuit';
import Logo from '../../../components/common/Logo';

// ============================================================
// Internal Helper Components
// ============================================================

function SectionLabel({ children }: { children: string }) {
  return <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-2 block">{children}</span>;
}

function GateSymbol({ type }: { type: string }) {
  const isInverted = ['NAND', 'NOR', 'NOT', 'XNOR'].includes(type);
  const isX = type === 'XOR' || type === 'XNOR';
  
  const getPath = () => {
    if (type.includes('AND')) return "M 3,1 L 10,1 A 6,6 0 0 1 10,13 L 3,13 Z";
    if (type.includes('OR') || type.includes('XOR')) return "M 2,1 C 6,1 12,1 17,7 C 12,13 6,13 2,13 C 5,7 5,7 2,1 Z";
    if (type === 'NOT' || type === 'BUFFER' || type === 'BUF') return "M 4,1 L 16,7 L 4,13 Z";
    return "";
  };

  return (
    <div className="flex flex-col items-center gap-1">
       <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible pointer-events-none">
          {isX && <path d="M -1,1.5 Q 3,7 -1,12.5" />}
          <path d={getPath()} />
          {isInverted && <circle cx={type === 'NOT' || type === 'BUF' ? 19 : type.includes('AND') ? 16 : 20} cy="7" r="2" fill="currentColor" fillOpacity="0.3" />}
       </svg>
       <span className="text-[7px] font-black tracking-widest uppercase text-main/40 pointer-events-none">{type === 'BUFFER' ? 'BUF' : type}</span>
    </div>
  );
}

function ToolButton({ 
  icon, 
  onClick, 
  onDragStart,
  draggable,
  active, 
  disabled, 
  variant = 'default',
  label
}: { 
  icon: React.ReactNode; 
  onClick?: () => void; 
  onDragStart?: (e: DragEvent) => void;
  draggable?: boolean;
  active?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'accent' | 'terminal' | 'gate';
  label?: string;
}) {
  const base = "flex items-center justify-center transition-all duration-200 border relative group";
  
  const variants = {
    default: active 
      ? 'w-9 h-9 rounded-xl bg-accent-blue/20 text-accent-blue border-accent-blue/30' 
      : 'w-9 h-9 rounded-xl text-dim hover:text-main hover:bg-card border-border-muted',
    danger: 'w-9 h-9 rounded-xl text-dim hover:text-accent-red hover:bg-accent-red/10 border-border-muted hover:border-accent-red/20',
    accent: active
      ? 'w-9 h-9 rounded-xl bg-accent-blue text-white border-accent-blue'
      : 'w-9 h-9 rounded-xl bg-card text-dim border-border-muted hover:border-border-main hover:text-main',
    terminal: 'w-10 h-10 rounded-full bg-card border-border-muted text-dim hover:text-accent-blue hover:border-accent-blue/40',
    gate: 'h-11 w-11 rounded-xl bg-card border-border-muted text-dim hover:text-main hover:bg-panel hover:border-border-main active:bg-accent-blue/10'
  };

  return (
    <button
      onClick={onClick}
      onDragStart={onDragStart}
      draggable={draggable}
      disabled={disabled}
      title={label}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer active:scale-95'} ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {icon}
    </button>
  );
}

export default function Toolbar() {
  const nodes = useCircuitStore((s: any) => s.nodes);
  const edges = useCircuitStore((s: any) => s.edges);
  const customICs = useCircuitStore((s: any) => s.customICs);
  const addNode = useCircuitStore((s: any) => s.addNode);
  const clearCircuit = useCircuitStore((s: any) => s.clearCircuit);
  const simulationMode = useCircuitStore((s: any) => s.simulationMode);
  const setSimulationMode = useCircuitStore((s: any) => s.setSimulationMode);

  const { 
    theme,
    toggleTheme,
    setDragging
  } = useUIStore();
  
  const projectName = useProjectStore((s: any) => s.projectName);

  const handleDragStart = useCallback((event: DragEvent, type: ComponentType) => {
    event.dataTransfer.setData('application/logiclab-type', type);
    event.dataTransfer.effectAllowed = 'move';
    setDragging(true, type);
  }, [setDragging]);

  const handleExport = useCallback(() => {
    const project = exportProject(nodes, edges, customICs, projectName);
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.logic`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, customICs, projectName]);

  const isLive = simulationMode === 'live';

  return (
    <header className="h-24 bg-app border-b border-muted flex items-center px-8 z-[100] relative shrink-0 w-full transition-theme">
      
      {/* 1. Brand */}
      <div className="flex items-center gap-4 pr-8 mr-6 border-r border-border-muted select-none">
        <Logo size={40} />
        <div className="flex flex-col">
          <h1 className="text-[17px] font-black uppercase tracking-[0.2em] text-main leading-none">LogicLab</h1>
          <p className="text-[8px] font-black text-accent-blue tracking-[0.4em] uppercase opacity-80 mt-2">Ultra V2</p>
        </div>
      </div>

      {/* 2. Terminals Section */}
      <div className="toolbar-section">
        <SectionLabel>Terminals</SectionLabel>
        <div className="flex items-center gap-2">
          <ToolButton 
            label="Switch Input" 
            variant="terminal" 
            icon={<ToggleLeft size={20} />} 
            onClick={() => addNode('INPUT', { x: 0, y: 0 })}
            draggable
            onDragStart={(e) => handleDragStart(e, 'INPUT')}
          />
          <ToolButton 
            label="Clock Source" 
            variant="terminal" 
            icon={<Clock size={18} />} 
            onClick={() => addNode('CLOCK', { x: 0, y: 0 })}
            draggable
            onDragStart={(e) => handleDragStart(e, 'CLOCK')}
          />
          <ToolButton 
            label="7-Segment" 
            variant="terminal" 
            icon={<div className="text-[10px] font-black leading-none pointer-events-none">7</div>} 
            onClick={() => addNode('SEVEN_SEGMENT', { x: 0, y: 0 })}
            draggable
            onDragStart={(e) => handleDragStart(e, 'SEVEN_SEGMENT')}
          />
          <ToolButton 
            label="LED Output" 
            variant="terminal" 
            icon={<Circle size={18} className="fill-accent-blue/20" />} 
            onClick={() => addNode('LED', { x: 0, y: 0 })}
            draggable
            onDragStart={(e) => handleDragStart(e, 'LED')}
          />
        </div>
      </div>

      <div className="w-8" />

      {/* 3. Logic Palace (Gates) */}
      <div className="toolbar-section">
        <SectionLabel>Logic Synthesis</SectionLabel>
        <div className="flex items-center gap-1">
          {['AND', 'OR', 'NOT', 'BUFFER', 'NAND', 'NOR', 'XOR', 'XNOR'].map((g) => (
            <ToolButton 
              key={g} 
              variant="gate" 
              label={`${g} Gate`}
              icon={<GateSymbol type={g} />} 
              onClick={() => addNode(g as ComponentType, { x: 0, y: 0 })} 
              draggable
              onDragStart={(e) => handleDragStart(e, g as ComponentType)}
            />
          ))}
        </div>
      </div>

      {/* Middle Spacer with Project Info */}
      <div className="flex-1 flex flex-col items-center justify-center mx-4">
         <span className="text-[8px] font-black text-muted uppercase tracking-[0.6em] mb-1.5 ">Active Project</span>
         <span className="text-[12px] font-black text-main uppercase tracking-[0.3em] truncate max-w-[200px]">{projectName || 'Untitled Project'}</span>
      </div>

      {/* 4. Engine State */}
      <div className="flex items-center gap-5 px-8 border-l border-border-muted h-full py-4">
         <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-black text-muted uppercase tracking-widest">Engine State</span>
            <div className="flex items-center gap-2">
               <span className={`text-[8px] font-black uppercase tracking-widest ${isLive ? 'text-accent-emerald' : 'text-dim'}`}>
                  {isLive ? 'Live' : 'Frozen'}
               </span>
               <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-accent-emerald' : 'bg-muted/40'}`} />
            </div>
         </div>
         <ToolButton 
           variant="accent"
           active={isLive}
           icon={<Zap size={22} className={isLive ? "fill-current" : ""} />} 
           onClick={() => setSimulationMode(isLive ? 'frozen' : 'live')}
         />
      </div>

      {/* 5. Global Actions */}
      <div className="flex items-center gap-2 ml-4">
        <ToolButton label="Toggle Theme" icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} onClick={toggleTheme} />
        <ToolButton label="Export Project" icon={<Download size={18} />} onClick={handleExport} />
        <ToolButton label="Settings" icon={<Settings size={18} />} />
        <ToolButton label="Clear Workspace" variant="danger" icon={<Trash2 size={18} />} onClick={() => clearCircuit()} />
      </div>
    </header>
  );
}
