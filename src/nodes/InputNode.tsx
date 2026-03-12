import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';
import { useCircuitStore } from '../store/circuitStore';

function InputNode({ data, selected, id }: NodeProps<CircuitNodeData>) {
  const toggleInput = useCircuitStore((s) => s.toggleInput);
  const { rotation } = data;

  const value = (data.properties.value as number) ?? 0;
  const isHigh = value === 1;

  const handleToggle = useCallback(() => {
    toggleInput(id);
  }, [id, toggleInput]);

  return (
    <div
      className="relative flex items-center justify-center w-12 h-12 group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <button
        onClick={handleToggle}
        className={`
          relative w-10 h-10 rounded-xl border-[3px] flex items-center justify-center
          cursor-pointer select-none focus:outline-none
          ${selected
            ? 'border-[var(--selection-color)]'
            : (isHigh
                ? 'bg-accent-blue border-accent-blue'
                : 'bg-app border-border-strong')}
        `}
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        <span className={`
          text-base font-black font-mono z-10
          ${isHigh ? 'text-white' : 'text-main'}
        `}>
          {value}
        </span>
      </button>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`
          !w-3 !h-3 !rounded-full !border-[3px] !-mr-1.5 z-10 !absolute !right-0
          ${isHigh
            ? '!bg-[#1a73e8] !border-white'
            : '!bg-[#9aa0a6] !border-[#5f6368]'}
        `}
      />
    </div>
  );
}

export default memo(InputNode);
