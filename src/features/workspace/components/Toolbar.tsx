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
  ToggleLeft,
  ChevronDown
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
  return <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-3 block opacity-50">{children}</span>;
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
    <div className="flex flex-col items-center gap-2">
       <svg width="24" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible pointer-events-none group-hover:scale-110 transition-transform">
          {isX && <path d="M -1,1.5 Q 3,7 -1,12.5" />}
          <path d={getPath()} />
          {isInverted && <circle cx={type === 'NOT' || type === 'BUF' ? 19 : type.includes('AND') ? 16 : 20} cy="7" r="1.8" fill="currentColor" />}
       </svg>
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
  const base = "flex items-center justify-center transition-all duration-300 border rounded-sm relative group";
  
  const variants = {
    default: active 
      ? 'w-10 h-10 bg-main text-app border-main' 
      : 'w-10 h-10 text-dim hover:text-main hover:bg-neutral-50 border-border-main',
    danger: 'w-10 h-10 text-dim hover:text-red-500 hover:bg-red-50 border-border-main hover:border-red-200',
    accent: active
      ? 'w-11 h-11 bg-main text-app border-main shadow-premium'
      : 'w-11 h-11 bg-app text-dim border-border-main hover:border-main hover:text-main',
    terminal: 'w-11 h-11 bg-app border-border-main text-dim hover:text-main hover:bg-neutral-50 shadow-sm',
    gate: 'h-11 w-11 bg-app border-border-main text-dim hover:text-main hover:bg-neutral-50 active:bg-neutral-100 shadow-sm'
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
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-main text-app text-[8px] font-black px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[200]">
        {label?.toUpperCase()}
      </div>
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

  const { theme, toggleTheme, setDragging } = useUIStore();
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
    <header className="h-24 bg-app border-b border-border-main flex items-center px-10 z-[100] relative shrink-0 w-full transition-all overflow-hidden text-clip">
      {/* 1. Brand Infrastructure */}
      <div className="flex items-center gap-6 pr-6 mr-6 border-r border-border-main shrink-0">
        <Logo size={42} className="hover:rotate-12 transition-transform duration-700" />
        <div className="flex flex-col">
          <h1 className="text-[20px] font-black uppercase tracking-tighter text-main leading-none">LogicLab</h1>
          <p className="text-[9px] font-black text-dim tracking-[0.5em] uppercase opacity-30 mt-2">Institutional V7</p>
        </div>
      </div>

      {/* 2. Laboratory Infrastructure */}
      <div className="flex items-center gap-8 shrink-0">
        <div className="flex flex-col">
          <SectionLabel>Infrastructure</SectionLabel>
          <div className="flex items-center gap-2">
            <ToolButton label="Toggle Input" variant="terminal" icon={<ToggleLeft size={20} />} onClick={() => addNode('INPUT', { x: 0, y: 0 })} draggable onDragStart={(e) => handleDragStart(e, 'INPUT')} />
            <ToolButton label="Clock Grid" variant="terminal" icon={<Clock size={20} />} onClick={() => addNode('CLOCK', { x: 0, y: 0 })} draggable onDragStart={(e) => handleDragStart(e, 'CLOCK')} />
            <ToolButton label="Decade Counter" variant="terminal" icon={<div className="text-[10px] font-black leading-none italic">7</div>} onClick={() => addNode('SEVEN_SEGMENT', { x: 0, y: 0 })} draggable onDragStart={(e) => handleDragStart(e, 'SEVEN_SEGMENT')} />
            <ToolButton label="Visual Node" variant="terminal" icon={<Circle size={20} />} onClick={() => addNode('LED', { x: 0, y: 0 })} draggable onDragStart={(e) => handleDragStart(e, 'LED')} />
          </div>
        </div>

        <div className="flex flex-col">
          <SectionLabel>Logic Synthesis</SectionLabel>
          <div className="flex items-center gap-1.5">
            {['AND', 'OR', 'NOT', 'BUFFER', 'NAND', 'NOR', 'XOR', 'XNOR'].map((g) => (
              <ToolButton key={g} variant="gate" label={g} icon={<GateSymbol type={g} />} onClick={() => addNode(g as ComponentType, { x: 0, y: 0 })} draggable onDragStart={(e) => handleDragStart(e, g as ComponentType)} />
            ))}
          </div>
        </div>
      </div>

      {/* Persistence State */}
      <div className="flex-1 min-w-[120px] flex flex-col items-center justify-center mx-6">
        <span className="text-[8px] font-black text-dim uppercase tracking-[0.6em] mb-2 opacity-30">Active Frame</span>
        <div className="flex items-center gap-3 group cursor-pointer">
          <span className="text-[14px] font-black text-main uppercase tracking-[0.2em] truncate max-w-[240px] leading-none group-hover:scale-105 transition-transform">{projectName || 'UNTITLED_PROTOCOL'}</span>
          <ChevronDown size={14} className="text-dim opacity-20 group-hover:opacity-100 transition-all" />
        </div>
      </div>

      {/* 4. Core Propulsion State */}
      <div className="flex items-center gap-6 px-6 border-l border-border-main h-full shrink-0">
        <div className="flex flex-col items-end gap-2">
          <span className="text-[9px] font-black text-dim uppercase tracking-widest opacity-40">Core Propulsion</span>
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-black uppercase tracking-widest ${isLive ? 'text-main' : 'text-dim opacity-30'}`}>{isLive ? 'ACTIVE' : 'STASIS'}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-neutral-200'}`} />
          </div>
        </div>
        <ToolButton variant="accent" active={isLive} label={isLive ? "Stasis Mode" : "Ignite Engine"} icon={<Zap size={24} className={isLive ? "fill-current" : ""} />} onClick={() => setSimulationMode(isLive ? 'frozen' : 'live')} />
      </div>

      {/* 5. Terminal Controls */}
      <div className="flex items-center gap-3 ml-8">
        <ToolButton label="Spectral Shift" icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} onClick={toggleTheme} />
        <ToolButton label="Persist State" icon={<Download size={18} />} onClick={handleExport} />
        <ToolButton label="Infrastructure Settings" icon={<Settings size={18} />} />
        <ToolButton label="Total Reset" variant="danger" icon={<Trash2 size={18} />} onClick={() => clearCircuit()} />
      </div>
    </header>
  );
}
