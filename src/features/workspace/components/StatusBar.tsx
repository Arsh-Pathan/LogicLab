import { useState, useEffect } from 'react';
import { useCircuitStore } from '../../../store/circuitStore';
import { useUIStore } from '../../../store/uiStore';
import { Zap, Activity, Cpu } from 'lucide-react';

function StatItem({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 first:pl-0 border-r border-muted/50 last:border-r-0">
      <div className="p-1.5 rounded-lg bg-card border border-border-muted text-dim">
        <Icon size={14} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="text-[13px] font-black text-main font-mono tracking-tight">{value}</span>
          <span className="text-[7px] font-black text-muted uppercase tracking-widest">{label}</span>
        </div>
      </div>
    </div>
  );
}

function Shortcut({ kbd, label }: { kbd: string, label: string }) {
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <span className="px-1.5 py-0.5 rounded bg-card border border-border-muted text-[9px] font-black text-main font-mono group-hover:bg-panel transition-colors uppercase">
        {kbd}
      </span>
      <span className="text-[10px] font-black text-muted group-hover:text-dim uppercase tracking-wider transition-colors">
        {label}
      </span>
    </div>
  );
}

export default function StatusBar() {
  const engine = useCircuitStore((s: any) => s.engine);
  const simulationMode = useCircuitStore((s: any) => s.simulationMode);
  const setSimulationMode = useCircuitStore((s: any) => s.setSimulationMode);
  const zoomLevel = useUIStore((s: any) => s.zoomLevel);
  
  const [metrics, setMetrics] = useState({ 
    evals: 0, 
    latency: '0.00ms',
    nodes: 0 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const state = engine.getState();
      setMetrics({
        evals: state.evaluationCount,
        latency: `${state.lastEvaluationTime.toFixed(2)}ms`,
        nodes: state.nodeCount
      });
    }, 100);
    return () => clearInterval(interval);
  }, [engine]);

  const isLive = simulationMode === 'live';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 pointer-events-none transition-theme">
      {/* Primary Floating Bar */}
      <div className="glass-panel h-14 rounded-2xl flex items-center px-6 pointer-events-auto border-border-main backdrop-blur-2xl">
        
        {/* Real-time Metrics */}
        <div className="flex items-center h-full">
          <StatItem icon={Zap} value={metrics.evals} label="Cycles" />
          <StatItem icon={Activity} value={metrics.latency} label="Latency" />
          <StatItem icon={Cpu} value={metrics.nodes} label="Nodes" />
        </div>

        <div className="w-px h-6 bg-muted/60 mx-6" />

        {/* Global Keybind Registry */}
        <div className="flex items-center gap-6">
          <Shortcut kbd="Space" label="Pan" />
          <Shortcut kbd="Ctrl+Z" label="Undo" />
          <Shortcut kbd="V" label="Select" />
          <Shortcut kbd="Del" label="Delete" />
        </div>

        <div className="w-px h-6 bg-muted/60 mx-6" />

        {/* Engine Toggle */}
        <button 
          onClick={() => setSimulationMode(isLive ? 'frozen' : 'live')}
          className="flex items-center gap-3 group"
        >
          <div className={`w-1.5 h-1.5 rounded-full transition-all ${isLive ? 'bg-accent-emerald' : 'bg-muted'}`} />
          <div className="flex flex-col items-start leading-none gap-1">
             <span className="text-[7px] font-black text-muted uppercase tracking-[0.25em]">Engine</span>
             <span className={`text-[10px] font-black uppercase tracking-widest ${isLive ? 'text-accent-emerald' : 'text-dim'}`}>
               SIM {isLive ? 'LIVE' : 'IDLE'}
             </span>
          </div>
        </button>
      </div>

      {/* Floating Zoom Widget */}
      <div className="glass-panel h-14 px-6 min-w-[100px] rounded-2xl flex items-center justify-center border-border-main pointer-events-auto">
        <span className="text-[13px] font-black text-accent-blue font-mono tracking-tighter">
          {(zoomLevel * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
