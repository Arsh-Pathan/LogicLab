import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function JunctionNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { inputs } = data;
  const signal = inputs[0]?.signal;
  const isHigh = signal === 1;

  return (
    <div className={`relative flex items-center justify-center w-4 h-4 ${selected ? 'z-[100]' : 'z-50'}`}>
      <div
        className={`w-2.5 h-2.5 rounded-full transition-all duration-75 pointer-events-none z-10 border-2
          ${selected 
            ? 'bg-[var(--selection-color)] border-[var(--selection-color)] scale-125' 
            : (isHigh ? 'bg-accent-blue border-accent-blue' : 'bg-slate-500 border-slate-500')
          }
        `}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="!w-full !h-full !bg-transparent !border-none !rounded-full !p-0"
        style={{ left: 0, top: 0, transform: 'none', position: 'absolute' }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="out_0"
        className="!w-full !h-full !bg-transparent !border-none !rounded-full !p-0 hover:!bg-accent-blue/20 cursor-crosshair"
        style={{ left: 0, top: 0, transform: 'none', position: 'absolute', zIndex: 20 }}
      />
    </div>
  );
}

export default memo(JunctionNode);
