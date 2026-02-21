// ============================================================
// Properties Panel — Right sidebar for selected node
// ============================================================

import { RotateCw, Plus, Minus, Activity, Settings2, Layout } from 'lucide-react';
import { useCircuitStore } from '../../../store/circuitStore';
import { useUIStore } from '../../../store/uiStore';
import { isGateType } from '../../../engine/gates';
import { Pin, CircuitNodeData } from '../../../types/circuit';
import { Node } from 'reactflow';

export default function PropertiesPanel() {
  const selectedNodeIds = useUIStore((s: any) => s.selectedNodeIds);
  const nodes = useCircuitStore((s: any) => s.nodes);
  const rotateNode = useCircuitStore((s: any) => s.rotateNode);
  const addInputToGate = useCircuitStore((s: any) => s.addInputToGate);
  const removeInputFromGate = useCircuitStore((s: any) => s.removeInputFromGate);
  const setClockFrequency = useCircuitStore((s: any) => s.setClockFrequency);
  const engine = useCircuitStore((s: any) => s.engine);

  const selectedNode = selectedNodeIds.length === 1
    ? nodes.find((n: Node<CircuitNodeData>) => n.id === selectedNodeIds[0])
    : null;

  return (
    <div className="h-full flex flex-col relative transition-theme">
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between shrink-0">
         <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-dim">Properties</h2>
         <Settings2 size={14} className="text-muted" />
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8 scrollbar-hide">
        {!selectedNode ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
            <Layout size={48} className="text-main mb-8" strokeWidth={1} />
            <span className="text-[11px] font-black text-main uppercase tracking-[0.5em]">Select Component</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Identity Card */}
            <div className="flex flex-col gap-1">
               <span className="text-[9px] font-black text-accent-blue uppercase tracking-[0.3em] mb-1">Active Object</span>
               <h3 className="text-2xl font-black text-main tracking-tight leading-none">{selectedNode.data.label || 'Unnamed Unit'}</h3>
               <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-muted text-[8px] font-bold text-dim uppercase tracking-widest">{selectedNode.data.type}</span>
                  <span className="text-[8px] font-bold text-muted uppercase font-mono">{selectedNode.id.split('-')[0]}</span>
               </div>
            </div>

            {/* Transform / Setup */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <h4 className="text-[9px] font-black text-muted uppercase tracking-[0.25em]">Configuration</h4>
               </div>
               
               {/* Rotation Control */}
               <div className="glass-card p-4 rounded-2xl border border-muted flex items-center justify-between hover:border-main transition-all group">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-main uppercase tracking-widest">Rotation</span>
                     <span className="text-[9px] font-mono text-muted uppercase font-bold">{selectedNode.data.rotation}° Axis</span>
                  </div>
                  <button 
                    onClick={() => rotateNode(selectedNode.id)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-accent-blue hover:text-white transition-all active:scale-90"
                  >
                    <RotateCw size={16} />
                  </button>
               </div>

               {/* Gate IO Controls */}
               {isGateType(selectedNode.data.type) && (
                 <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => addInputToGate(selectedNode.id)} className="h-14 rounded-2xl bg-white/5 border border-muted text-main flex flex-col items-center justify-center gap-1 hover:border-accent-emerald hover:text-accent-emerald transition-all group active:scale-95">
                      <Plus size={16} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Add Port</span>
                   </button>
                   <button onClick={() => removeInputFromGate(selectedNode.id)} disabled={selectedNode.data.inputs.length <= 1} className="h-14 rounded-2xl bg-white/5 border border-muted text-main flex flex-col items-center justify-center gap-1 hover:border-accent-red hover:text-accent-red transition-all disabled:opacity-20 group active:scale-95">
                      <Minus size={16} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Remove</span>
                   </button>
                 </div>
               )}

               {/* Clock Settings */}
               {selectedNode.data.type === 'CLOCK' && (
                 <div className="glass-card p-5 rounded-2xl border border-muted">
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest block mb-4">Oscillator Frequency</span>
                    <div className="flex items-center gap-4">
                       <input 
                         type="number" 
                         value={(selectedNode.data.properties.frequency as number) ?? 1} 
                         onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val) && val > 0) setClockFrequency(selectedNode.id, val); }} 
                         className="flex-1 bg-white/5 text-main text-lg rounded-xl px-4 py-3 border border-muted focus:border-accent-blue focus:outline-none font-mono font-bold transition-all text-center" 
                       />
                       <span className="text-[11px] font-black text-muted uppercase tracking-widest">Hz</span>
                    </div>
                 </div>
               )}
            </div>

            {/* Telemetry Block */}
            <div className="space-y-4 pt-4">
               <h4 className="text-[9px] font-black text-accent-blue uppercase tracking-[0.3em] flex items-center gap-2">
                 <Activity size={10} /> Live Diagnostics
               </h4>
               <div className="bg-white/[0.02] rounded-2xl p-6 border border-muted space-y-4">
                 {selectedNode.data.outputs.map((pin: Pin) => {
                   const nodeOutputs = engine.getNodeOutputs(selectedNode.id);
                   const val = nodeOutputs.get(pin.id);
                   const isHigh = val === 1;
                   return (
                     <div key={pin.id} className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-dim tracking-widest uppercase mb-1">{pin.label}</span>
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-accent-blue' : 'bg-muted'}`} />
                              <span className={`text-[11px] font-black font-mono tracking-tighter ${isHigh ? 'text-accent-blue' : 'text-muted'}`}>{isHigh ? 'SIGNAL HI' : 'SIGNAL LO'}</span>
                           </div>
                        </div>
                        <div className="h-10 w-1 flex items-end bg-white/5 rounded-full overflow-hidden">
                           <div className={`w-full transition-all duration-300 ${isHigh ? 'h-full bg-accent-blue' : 'h-0'}`} />
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* System Performance */}
            <div className="grid grid-cols-2 gap-3 pb-8">
               <div className="bg-white/5 rounded-2xl p-4 border border-muted">
                  <span className="text-[7px] font-black text-muted uppercase tracking-widest block mb-2">Cycle Load</span>
                  <div className="text-[14px] font-black text-accent-blue/80 font-mono">{(engine.getState().lastEvaluationTime || 0).toFixed(2)}<span className="text-[8px] opacity-30 ml-1 uppercase">ms</span></div>
               </div>
               <div className="bg-white/5 rounded-2xl p-4 border border-muted">
                  <span className="text-[7px] font-black text-muted uppercase tracking-widest block mb-2">Node Rank</span>
                  <div className="text-[14px] font-black text-main/30 font-mono">#{selectedNode.id.split('-')[0].substring(0,4)}</div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
