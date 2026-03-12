import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function OutputNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { inputs, rotation } = data;
  const inputSignal = inputs[0]?.signal;
  const isHigh = inputSignal === 1;

  return (
    <div
      className="relative flex items-center"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in_0"
        className={`
          !w-4 !h-4 !rounded-full !border-[3px] !absolute !-left-2
          ${isHigh
            ? '!bg-white !border-[#1a73e8]'
            : '!bg-[#9aa0a6] !border-[#5f6368]'}
        `}
      />

      {/* Signal Lens */}
      <div
        className={`
          w-16 h-16 rounded-full border-[5px] flex items-center justify-center
          relative overflow-hidden
          ${selected
            ? 'border-[var(--selection-color)]'
            : (isHigh ? 'bg-accent-blue border-white' : 'bg-app border-border-muted')
          }
        `}
      >
        <div
          className={`text-2xl font-black font-mono z-10
            ${isHigh ? 'text-white' : 'text-main/20'}`}
          style={{ transform: `rotate(-${rotation}deg)` }}
        >
          {isHigh ? 'HI' : 'LO'}
        </div>

        <div className="absolute top-2 left-4 w-5 h-3 bg-white/10 rounded-full rotate-[-30deg]" />
      </div>
    </div>
  );
}

export default memo(OutputNode);
