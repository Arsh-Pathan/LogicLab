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
        className={`!w-3 !h-3 !rounded-full !border-[3px] !-ml-1 z-10
          ${isHigh ? '!bg-accent-blue !border-white' : '!bg-app !border-muted'}
        `}
      />

      <div
        className={`
          w-10 h-10 rounded-full border-[3px] flex items-center justify-center absolute
          ${selected
            ? 'border-[var(--selection-color)]'
            : (isHigh ? 'bg-red-500 border-red-400' : 'bg-app border-border-muted')}
        `}
      >
        <div
          className={`w-5 h-5 rounded-full ${
            isHigh ? 'bg-white' : 'bg-dim/10'
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
