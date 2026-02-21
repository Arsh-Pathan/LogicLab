import { useState, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  BackgroundVariant, 
  Handle, 
  Position,
  NodeProps,
  Edge,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Zap, RotateCcw } from 'lucide-react';

// ============================================================
// Simplified Home-Specific Node Components
// ============================================================

const LiteInputNode = ({ data }: NodeProps) => {
  return (
    <div 
      onClick={data.onToggle}
      className={`w-16 h-10 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
        data.value ? 'bg-blue-500 border-blue-400' : 'bg-slate-900 border-slate-700'
      }`}
    >
      <span className="text-[10px] font-black uppercase tracking-tighter">
        {data.value ? 'HIGH' : 'LOW'}
      </span>
      <Handle type="source" position={Position.Right} className="!bg-blue-400 !w-2 !h-2 !border-none" />
    </div>
  );
};

const LiteGateNode = ({ data }: NodeProps) => {
  return (
    <div className={`px-8 py-6 rounded-3xl flex flex-col items-center gap-2 min-w-[140px] transition-all duration-700 relative overflow-hidden ${
      data.result 
        ? 'bg-blue-600/10 border-blue-500/50' 
        : 'bg-slate-950 border-white/5'
    } border backdrop-blur-3xl`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !border-none !bg-slate-700" style={{ left: -6 }} />
      <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 relative z-10">Gate Protocol</span>
      <span className={`text-3xl font-black font-premium tracking-tighter relative z-10 transition-colors duration-500 ${
        data.result ? 'text-white' : 'text-slate-500'
      }`}>
        {data.label}
      </span>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !border-none !bg-slate-700" style={{ right: -6 }} />
    </div>
  );
};

const LiteOutputNode = ({ data }: NodeProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !border-none !bg-slate-700" style={{ left: -6 }} />
      <div className={`w-20 h-20 rounded-full border-4 transition-all duration-700 flex items-center justify-center relative ${
        data.value 
          ? 'bg-blue-500/20 border-blue-400' 
          : 'bg-slate-900/50 border-slate-800'
      }`}>
        {/* Removed animate-ping */}
        <Zap size={32} className={`transition-all duration-500 ${data.value ? 'text-white fill-white' : 'text-slate-700'}`} />
      </div>
      <div className="flex flex-col items-center">
         <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity duration-500 ${data.value ? 'opacity-100 text-blue-400' : 'opacity-20'}`}>
           Result Found
         </span>
         <span className="text-[8px] font-bold uppercase opacity-20 tracking-tighter">Evaluation Finalized</span>
      </div>
    </div>
  );
};

const nodeTypes = {
  liteInput: LiteInputNode,
  liteGate: LiteGateNode,
  liteOutput: LiteOutputNode,
};

// ============================================================
// Main Demo Component
// ============================================================

export default function HomeInteractiveDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  // Simple XOR logic for the demo
  const result = a !== b;

  const nodes: Node[] = useMemo(() => [
    {
      id: 'in-a',
      type: 'liteInput',
      position: { x: 0, y: 0 },
      data: { value: a, onToggle: () => setA(!a) },
    },
    {
      id: 'in-b',
      type: 'liteInput',
      position: { x: 0, y: 140 },
      data: { value: b, onToggle: () => setB(!b) },
    },
    {
      id: 'gate',
      type: 'liteGate',
      position: { x: 260, y: 65 },
      data: { label: 'XOR', result },
    },
    {
      id: 'out',
      type: 'liteOutput',
      position: { x: 550, y: 65 },
      data: { value: result },
    },
  ], [a, b, result]);

  const edges: Edge[] = [
    { 
      id: 'e1', 
      source: 'in-a', 
      target: 'gate', 
      type: 'smoothstep', 
      animated: a, 
      style: { 
        stroke: a ? '#3b82f6' : '#1e293b', 
        strokeWidth: 4
      } 
    },
    { 
      id: 'e2', 
      source: 'in-b', 
      target: 'gate', 
      type: 'smoothstep', 
      animated: b, 
      style: { 
        stroke: b ? '#3b82f6' : '#1e293b', 
        strokeWidth: 4
      } 
    },
    { 
      id: 'e3', 
      source: 'gate', 
      target: 'out', 
      type: 'smoothstep', 
      animated: result, 
      style: { 
        stroke: result ? '#3b82f6' : '#1e293b', 
        strokeWidth: 4
      } 
    },
  ];

  return (
    <div className="w-full h-full bg-[#02040a]/80 rounded-[4rem] border border-white/10 overflow-hidden relative group">
      <div className="absolute top-12 left-12 z-10 flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Live Synthesis Engine</span>
         </div>
         <span className="text-3xl font-black font-premium tracking-tighter uppercase text-white/90">Signal Trace: Alpha</span>
      </div>

      <div className="absolute bottom-12 right-12 z-10 opacity-20 group-hover:opacity-40 transition-opacity">
         <RotateCcw 
          size={32} 
          className="cursor-pointer hover:rotate-180 transition-transform duration-700" 
          onClick={() => { setA(false); setB(false); }}
         />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={40} 
          size={0.5} 
          color="rgba(255,255,255,0.02)" 
        />
      </ReactFlow>

      {/* Interactive Legend */}
      <div className="absolute bottom-12 left-12 p-6 glass-premium rounded-3xl border-white/5 pointer-events-none">
         <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Active Signal</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-800" />
               <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Null State</span>
            </div>
         </div>
      </div>
    </div>
  );
}
