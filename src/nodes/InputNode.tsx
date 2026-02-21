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
      className="relative flex items-center group transition-all duration-75"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <button
        onClick={handleToggle}
        className={`
          relative w-14 h-14 rounded-3xl border-[4px] flex items-center justify-center
          cursor-pointer transition-all duration-75 select-none overflow-hidden
          ${selected 
            ? 'border-[var(--selection-color)] !scale-110 !z-[100]' 
            : (isHigh ? 'bg-accent-blue border-white' : 'bg-card border-border-muted hover:border-border-main')
          }
        `}
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        <div className={`
          text-2xl font-black font-mono transition-all duration-75 z-10
          ${isHigh ? 'text-white' : 'text-main/40'}
        `}>
          {value}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20" />
      </button>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`
          !w-4 !h-4 !rounded-full !border-[3px] transition-all duration-75 !absolute !-right-2
          ${isHigh 
            ? '!bg-white !border-accent-blue' 
            : '!bg-app !border-muted'}
        `}
      />
    </div>
  );
}

export default memo(InputNode);
