import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function LEDNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { label, inputs, rotation } = data;
  const inputSignal = inputs[0]?.signal;
  const isHigh = inputSignal === 1;

  return (
    <div
      className="relative flex items-center justify-center w-12 h-12"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in_0"
        className={`!w-3 !h-3 !rounded-full !border-[3px] !-ml-1 transition-colors z-10 
          ${isHigh ? '!bg-accent-blue !border-white' : '!bg-app !border-muted hover:!border-main'}
        `}
      />

      <div
        className={`
          w-10 h-10 rounded-full border-[3px] flex items-center justify-center
          transition-all duration-75 absolute
          ${selected 
            ? 'border-[var(--selection-color)] !scale-110 !z-[100]' 
            : (isHigh ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-app border-border-muted hover:border-border-main')}
        `}
      >
        <div
          className={`w-5 h-5 rounded-full transition-all duration-75 ${
            isHigh
              ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
              : 'bg-dim/10'
          }`}
        />
      </div>
      
      <div
        className="absolute -bottom-6 text-[9px] font-black uppercase tracking-widest text-dim text-center w-32"
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        {label}
      </div>
    </div>
  );
}

export default memo(LEDNode);
