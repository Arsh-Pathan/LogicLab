import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function LEDNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { label, inputs, rotation } = data;
  const inputSignal = inputs[0]?.signal;
  const isHigh = inputSignal === 1;

  return (
    <div
      className="relative flex items-center gap-1"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in_0"
        className="!w-2.5 !h-2.5 !rounded-full !border-2 transition-colors"
        style={{
          backgroundColor: isHigh ? '#22c55e' : '#1f2937',
          borderColor: isHigh ? '#22c55e' : '#4b5563',
        }}
      />

      <div className="flex flex-col items-center">
        <div
          className={`
            w-10 h-10 rounded-full border-2 flex items-center justify-center
            transition-all duration-75
            ${selected ? 'border-[var(--selection-color)] !scale-110 !z-[100]' : (isHigh ? 'bg-red-500 border-red-400' : 'bg-card border-border-muted')}
          `}
        >
          <div
            className={`w-5 h-5 rounded-full transition-all duration-75 ${
              isHigh
                ? 'bg-red-300'
                : 'bg-dim/20'
            }`}
          />
        </div>
        <div
          className="text-[8px] uppercase tracking-wider text-dim mt-1"
          style={{ transform: `rotate(-${rotation}deg)` }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default memo(LEDNode);
