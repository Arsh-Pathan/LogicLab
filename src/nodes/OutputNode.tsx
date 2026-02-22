import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function OutputNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { inputs, rotation } = data;
  const inputSignal = inputs[0]?.signal;
  const isHigh = inputSignal === 1;

  return (
    <div
      className="relative flex items-center transition-all duration-75"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in_0"
        className={`
          !w-4 !h-4 !rounded-full !border-[3px] transition-all duration-75 !absolute !-left-2
          ${isHigh 
            ? '!bg-white !border-accent-blue' 
            : '!bg-app !border-muted'}
        `}
      />

      {/* Illustrative Signal Lens */}
      <div
        className={`
          w-16 h-16 rounded-full border-[5px] flex items-center justify-center
          transition-all duration-75 relative overflow-hidden
          ${selected 
            ? 'border-[var(--selection-color)] !scale-110 !z-[100]' 
            : (isHigh ? 'bg-accent-blue border-white shadow-[0_0_20px_rgba(14,165,233,0.5)]' : 'bg-app border-border-muted hover:border-border-main')
          }
        `}
      >
        <div
          className={`text-2xl font-black font-mono transition-all duration-75 z-10
            ${isHigh ? 'text-white' : 'text-main/20'}`}
          style={{ transform: `rotate(-${rotation}deg)` }}
        >
          {isHigh ? 'HI' : 'LO'}
        </div>

        {/* Playful Lens Flare (Solid) */}
        <div className="absolute top-2 left-4 w-5 h-3 bg-white/10 rounded-full rotate-[-30deg]" />
      </div>
    </div>
  );
}

export default memo(OutputNode);
